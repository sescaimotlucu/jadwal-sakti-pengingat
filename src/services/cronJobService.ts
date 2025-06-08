
interface ScheduledJob {
  id: string;
  activityId: number;
  type: 'H-2' | 'H-1' | 'Hari-H';
  scheduledTime: Date;
  targetNumbers: string[];
  message: string;
  status: 'scheduled' | 'sent' | 'failed';
}

class CronJobService {
  private jobs: Map<string, NodeJS.Timeout> = new Map();
  private scheduledJobs: ScheduledJob[] = [];

  // Pastikan pesan terkirim ke nomor yang tepat
  scheduleReminder(
    activityId: number,
    activityName: string,
    activityDate: string,
    activityTime: string,
    location: string,
    targetNumbers: string[] = ['082115575219'] // Default ke nomor yang ditentukan
  ): void {
    const activityDateTime = new Date(`${activityDate}T${activityTime}`);
    
    // Hitung waktu pengingat
    const reminderTimes = {
      'H-2': new Date(activityDateTime.getTime() - (2 * 24 * 60 * 60 * 1000)),
      'H-1': new Date(activityDateTime.getTime() - (1 * 24 * 60 * 60 * 1000)),
      'Hari-H': new Date(activityDateTime.getTime() - (2 * 60 * 60 * 1000)) // 2 jam sebelum
    };

    const now = new Date();

    // Jadwalkan setiap jenis pengingat
    Object.entries(reminderTimes).forEach(([type, scheduledTime]) => {
      if (scheduledTime > now) {
        const jobId = `${activityId}-${type}`;
        
        // Buat pesan berdasarkan jenis pengingat
        const message = this.createMessage(type as 'H-2' | 'H-1' | 'Hari-H', {
          activityName,
          activityDate,
          activityTime,
          location
        });

        // Simpan job yang dijadwalkan
        const scheduledJob: ScheduledJob = {
          id: jobId,
          activityId,
          type: type as 'H-2' | 'H-1' | 'Hari-H',
          scheduledTime,
          targetNumbers,
          message,
          status: 'scheduled'
        };
        
        this.scheduledJobs.push(scheduledJob);

        // Set timeout untuk eksekusi
        const timeoutId = setTimeout(async () => {
          await this.executeReminderJob(scheduledJob);
        }, scheduledTime.getTime() - now.getTime());

        this.jobs.set(jobId, timeoutId);
        
        console.log(`✅ Pengingat ${type} dijadwalkan untuk ${scheduledTime.toLocaleString('id-ID')}`);
        console.log(`📱 Target nomor: ${targetNumbers.join(', ')}`);
      }
    });
  }

  private createMessage(
    type: 'H-2' | 'H-1' | 'Hari-H',
    details: {
      activityName: string;
      activityDate: string;
      activityTime: string;
      location: string;
    }
  ): string {
    const { activityName, activityDate, activityTime, location } = details;
    const formattedDate = new Date(activityDate).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    switch (type) {
      case 'H-2':
        return `🔔 *PENGINGAT H-2*

Assalamualaikum Wr. Wb.

Jangan lupa, kegiatan *${activityName}* akan dilaksanakan pada:

📅 *Hari/Tanggal:* ${formattedDate}
🕐 *Waktu:* ${activityTime} WIB
📍 *Tempat:* ${location}

Mohon persiapkan diri dan jangan sampai terlewat ya! 😊

Wassalamualaikum Wr. Wb.

_Sistem Pengingat Otomatis Desa_`;

      case 'H-1':
        return `⏰ *PENGINGAT H-1*

Assalamualaikum Wr. Wb.

Besok ada kegiatan *${activityName}*:

📅 *Hari/Tanggal:* ${formattedDate}
🕐 *Waktu:* ${activityTime} WIB  
📍 *Tempat:* ${location}

Jangan lupa hadir tepat waktu! 📅✨

Wassalamualaikum Wr. Wb.

_Sistem Pengingat Otomatis Desa_`;

      case 'Hari-H':
        return `🌟 *PENGINGAT HARI H*

Assalamualaikum Wr. Wb.

Selamat pagi! Hari ini ada kegiatan *${activityName}*:

🕐 *Waktu:* ${activityTime} WIB
📍 *Tempat:* ${location}

Sampai jumpa di lokasi! 🎯

Wassalamualaikum Wr. Wb.

_Sistem Pengingat Otomatis Desa_`;

      default:
        return `Pengingat kegiatan ${activityName} pada ${formattedDate} jam ${activityTime} di ${location}`;
    }
  }

  private async executeReminderJob(job: ScheduledJob): Promise<void> {
    console.log(`🚀 Menjalankan pengingat ${job.type} untuk kegiatan ID ${job.activityId}`);
    
    try {
      // Import whatsappService secara dinamis untuk menghindari circular dependency
      const { whatsappService } = await import('./whatsappService');
      
      // Kirim pesan ke setiap nomor target
      for (const phoneNumber of job.targetNumbers) {
        console.log(`📤 Mengirim pesan ${job.type} ke ${phoneNumber}`);
        
        const result = await whatsappService.sendMessage({
          number: phoneNumber,
          message: job.message
        });

        // Update status job
        if (result.success) {
          job.status = 'sent';
          console.log(`✅ Pesan ${job.type} berhasil dikirim ke ${phoneNumber}`);
        } else {
          job.status = 'failed';
          console.error(`❌ Gagal mengirim pesan ${job.type} ke ${phoneNumber}:`, result.message);
        }

        // Log ke database
        const { databaseService } = await import('./databaseService');
        await databaseService.addReminderLog({
          kegiatan_id: job.activityId,
          user_id: 1, // Default admin user
          jenis_pengingat: job.type,
          nomor_tujuan: phoneNumber,
          pesan: job.message,
          status_kirim: result.success ? 'terkirim' : 'gagal',
          waktu_kirim: result.success ? new Date().toISOString() : undefined,
          response_whatsapp: result.success ? JSON.stringify(result.data) : undefined,
          error_message: result.success ? undefined : result.message
        });
      }

      // Hapus job dari daftar aktif
      this.jobs.delete(job.id);
      
    } catch (error) {
      console.error(`❌ Error executing reminder job ${job.id}:`, error);
      job.status = 'failed';
    }
  }

  // Batalkan pengingat untuk kegiatan tertentu
  cancelReminders(activityId: number): void {
    const types: ('H-2' | 'H-1' | 'Hari-H')[] = ['H-2', 'H-1', 'Hari-H'];
    
    types.forEach(type => {
      const jobId = `${activityId}-${type}`;
      const timeoutId = this.jobs.get(jobId);
      
      if (timeoutId) {
        clearTimeout(timeoutId);
        this.jobs.delete(jobId);
        console.log(`🚫 Pengingat ${type} untuk kegiatan ${activityId} dibatalkan`);
      }
    });

    // Hapus dari daftar scheduled jobs
    this.scheduledJobs = this.scheduledJobs.filter(job => job.activityId !== activityId);
  }

  // Dapatkan daftar job yang dijadwalkan
  getScheduledJobs(): ScheduledJob[] {
    return this.scheduledJobs.filter(job => job.status === 'scheduled');
  }

  // Test manual pengiriman
  async testReminder(
    phoneNumber: string,
    activityName: string,
    type: 'H-2' | 'H-1' | 'Hari-H'
  ): Promise<{ success: boolean; message: string }> {
    try {
      const testMessage = this.createMessage(type, {
        activityName,
        activityDate: new Date().toISOString().split('T')[0],
        activityTime: '10:00',
        location: 'Test Location'
      });

      const { whatsappService } = await import('./whatsappService');
      const result = await whatsappService.sendMessage({
        number: phoneNumber,
        message: testMessage
      });

      if (result.success) {
        console.log(`✅ Test pengingat ${type} berhasil dikirim ke ${phoneNumber}`);
        return {
          success: true,
          message: `Test pengingat ${type} berhasil dikirim ke ${phoneNumber}`
        };
      } else {
        console.error(`❌ Test pengingat ${type} gagal:`, result.message);
        return {
          success: false,
          message: `Gagal mengirim test pengingat: ${result.message}`
        };
      }
    } catch (error) {
      console.error('❌ Error sending test reminder:', error);
      return {
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

export const cronJobService = new CronJobService();
export type { ScheduledJob };
