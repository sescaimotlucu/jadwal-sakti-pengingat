import { cronJobService } from './cronJobService';

interface ReminderSchedule {
  activityId: number;
  activityName: string;
  activityDate: string;
  activityTime: string;
  location: string;
  targetNumbers?: string[];
}

class ReminderService {
  private readonly mainTargetNumber = '6288137216822'; // +62 881-3721-682

  // Jadwalkan pengingat otomatis
  async scheduleReminders(schedule: ReminderSchedule): Promise<void> {
    const { 
      activityId, 
      activityName, 
      activityDate, 
      activityTime, 
      location, 
      targetNumbers = [this.mainTargetNumber] // Default ke nomor utama
    } = schedule;

    console.log(`📋 Menjadwalkan pengingat untuk kegiatan: ${activityName}`);
    console.log(`📱 Target nomor: ${targetNumbers.join(', ')}`);
    console.log(`🎯 Nomor utama: +62 881-3721-682`);

    // Pastikan nomor utama selalu termasuk
    const finalTargetNumbers = [...new Set([this.mainTargetNumber, ...targetNumbers])];

    // Gunakan cronJobService untuk penjadwalan yang lebih reliable
    cronJobService.scheduleReminder(
      activityId,
      activityName,
      activityDate,
      activityTime,
      location,
      finalTargetNumbers
    );

    console.log(`✅ Pengingat dijadwalkan untuk ${finalTargetNumbers.length} nomor`);
  }

  // Batalkan pengingat
  cancelReminders(activityId: number): void {
    console.log(`🚫 Membatalkan pengingat untuk kegiatan ID: ${activityId}`);
    cronJobService.cancelReminders(activityId);
  }

  // Test pengiriman manual
  async sendTestReminder(
    phoneNumber: string,
    activityName: string,
    activityDate: string,
    activityTime: string,
    type: 'H-2' | 'H-1' | 'Hari-H'
  ): Promise<{ success: boolean; message: string }> {
    console.log(`🧪 Mengirim test pengingat ${type} ke ${phoneNumber}`);
    console.log(`📋 Kegiatan: ${activityName}`);
    
    const result = await cronJobService.testReminder(phoneNumber, activityName, type);
    
    if (result.success) {
      console.log(`✅ Test pengingat ${type} berhasil dikirim`);
    } else {
      console.error(`❌ Test pengingat ${type} gagal:`, result.message);
    }
    
    return result;
  }

  // Dapatkan status pengingat yang dijadwalkan
  getScheduledReminders() {
    const jobs = cronJobService.getScheduledJobs();
    console.log(`📊 Total pengingat terjadwal: ${jobs.length}`);
    return jobs;
  }

  // Kirim pengingat langsung ke nomor utama
  async sendDirectReminder(message: string): Promise<{ success: boolean; message: string }> {
    console.log(`📤 Mengirim pengingat langsung ke nomor utama: ${this.mainTargetNumber}`);
    
    try {
      const { whatsappService } = await import('./whatsappService');
      const result = await whatsappService.sendToMainNumber(message);
      
      if (result.success) {
        console.log(`✅ Pengingat langsung berhasil dikirim ke +62 881-3721-682`);
        return {
          success: true,
          message: `✅ Pengingat berhasil dikirim ke +62 881-3721-682`
        };
      } else {
        console.error(`❌ Gagal mengirim pengingat langsung:`, result.message);
        return {
          success: false,
          message: `❌ Gagal mengirim: ${result.message}`
        };
      }
    } catch (error) {
      console.error('❌ Error sending direct reminder:', error);
      return {
        success: false,
        message: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Method untuk mengirim konfirmasi penjadwalan
  async sendScheduleConfirmation(activityName: string, activityDate: string, activityTime: string, location: string): Promise<{ success: boolean; message: string }> {
    const confirmationMessage = `✅ *KONFIRMASI JADWAL KEGIATAN*

Assalamualaikum Wr. Wb.

Kegiatan *${activityName}* telah berhasil dijadwalkan:

📅 *Tanggal:* ${new Date(activityDate).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}
🕐 *Waktu:* ${activityTime} WIB
📍 *Tempat:* ${location}

🔔 *Pengingat Otomatis:*
• H-2: Dua hari sebelum kegiatan
• H-1: Satu hari sebelum kegiatan  
• Hari-H: Pada hari kegiatan (2 jam sebelum)

Terima kasih! 😊

Wassalamualaikum Wr. Wb.

_Sistem Pengingat Otomatis Desa_`;

    console.log(`📋 Mengirim konfirmasi penjadwalan untuk: ${activityName}`);
    return this.sendDirectReminder(confirmationMessage);
  }
}

export const reminderService = new ReminderService();
export type { ReminderSchedule };