
import { whatsappService } from './whatsappService';
import { databaseService } from './databaseService';

interface ReminderSchedule {
  activityId: number;
  activityName: string;
  activityDate: string;
  activityTime: string;
  location: string;
  targetNumber: string;
}

class ReminderService {
  private scheduledReminders: Map<string, NodeJS.Timeout> = new Map();

  async scheduleReminders(schedule: ReminderSchedule): Promise<void> {
    const { activityId, activityName, activityDate, activityTime, location, targetNumber } = schedule;
    const activityDateTime = new Date(`${activityDate}T${activityTime}`);
    
    // Calculate reminder times
    const h2DateTime = new Date(activityDateTime.getTime() - (2 * 24 * 60 * 60 * 1000)); // 2 days before
    const h1DateTime = new Date(activityDateTime.getTime() - (1 * 24 * 60 * 60 * 1000)); // 1 day before
    const hariHDateTime = new Date(activityDateTime.getTime()); // Same day
    
    const now = new Date();

    // Schedule H-2 reminder
    if (h2DateTime > now) {
      this.scheduleReminder(activityId, 'H-2', h2DateTime, {
        activityName,
        activityDate,
        activityTime,
        location,
        targetNumber
      });
    }

    // Schedule H-1 reminder
    if (h1DateTime > now) {
      this.scheduleReminder(activityId, 'H-1', h1DateTime, {
        activityName,
        activityDate,
        activityTime,
        location,
        targetNumber
      });
    }

    // Schedule Hari-H reminder (2 hours before activity)
    const hariHReminderTime = new Date(hariHDateTime.getTime() - (2 * 60 * 60 * 1000));
    if (hariHReminderTime > now) {
      this.scheduleReminder(activityId, 'Hari-H', hariHReminderTime, {
        activityName,
        activityDate,
        activityTime,
        location,
        targetNumber
      });
    }
  }

  private scheduleReminder(
    activityId: number,
    type: 'H-2' | 'H-1' | 'Hari-H',
    reminderTime: Date,
    details: {
      activityName: string;
      activityDate: string;
      activityTime: string;
      location: string;
      targetNumber: string;
    }
  ): void {
    const timeoutId = setTimeout(async () => {
      await this.sendReminder(activityId, type, details);
    }, reminderTime.getTime() - Date.now());

    const key = `${activityId}-${type}`;
    this.scheduledReminders.set(key, timeoutId);
    
    console.log(`Pengingat ${type} dijadwalkan untuk ${reminderTime.toLocaleString()}`);
  }

  private async sendReminder(
    activityId: number,
    type: 'H-2' | 'H-1' | 'Hari-H',
    details: {
      activityName: string;
      activityDate: string;
      activityTime: string;
      location: string;
      targetNumber: string;
    }
  ): Promise<void> {
    try {
      // Generate message based on type
      let message = '';
      const { activityName, activityDate, activityTime, location } = details;
      
      switch (type) {
        case 'H-2':
          message = `🔔 PENGINGAT H-2\n\nHai! Jangan lupa, kegiatan "${activityName}" akan dilaksanakan pada:\n📅 ${activityDate}\n🕐 ${activityTime}\n📍 ${location}\n\nPersiapkan diri Anda ya! 😊`;
          break;
        case 'H-1':
          message = `⏰ PENGINGAT H-1\n\nBesok ada kegiatan "${activityName}":\n📅 ${activityDate}\n🕐 ${activityTime}\n📍 ${location}\n\nJangan sampai terlewat! 📅`;
          break;
        case 'Hari-H':
          message = `🌟 PENGINGAT HARI H\n\nSelamat pagi! Hari ini ada kegiatan "${activityName}":\n🕐 ${activityTime}\n📍 ${location}\n\nSampai jumpa di lokasi! 🎯`;
          break;
      }

      // Send WhatsApp message
      const result = await whatsappService.sendMessage({
        number: details.targetNumber,
        message: message
      });

      // Log to database
      await databaseService.addReminderLog({
        kegiatan_id: activityId,
        user_id: 1, // Current user ID
        jenis_pengingat: type,
        nomor_tujuan: details.targetNumber,
        pesan: message,
        status_kirim: result.success ? 'terkirim' : 'gagal',
        waktu_kirim: result.success ? new Date().toISOString() : undefined,
        response_whatsapp: result.success ? JSON.stringify(result.data) : undefined,
        error_message: result.success ? undefined : result.message
      });

      console.log(`Pengingat ${type} ${result.success ? 'berhasil' : 'gagal'} dikirim`);
    } catch (error) {
      console.error(`Error sending ${type} reminder:`, error);
      
      // Log failed attempt
      await databaseService.addReminderLog({
        kegiatan_id: activityId,
        user_id: 1,
        jenis_pengingat: type,
        nomor_tujuan: details.targetNumber,
        pesan: '',
        status_kirim: 'gagal',
        error_message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  cancelReminders(activityId: number): void {
    const types: ('H-2' | 'H-1' | 'Hari-H')[] = ['H-2', 'H-1', 'Hari-H'];
    
    types.forEach(type => {
      const key = `${activityId}-${type}`;
      const timeoutId = this.scheduledReminders.get(key);
      if (timeoutId) {
        clearTimeout(timeoutId);
        this.scheduledReminders.delete(key);
        console.log(`Pengingat ${type} dibatalkan`);
      }
    });
  }

  // Manual send for testing
  async sendTestReminder(
    phoneNumber: string,
    activityName: string,
    activityDate: string,
    activityTime: string,
    type: 'H-2' | 'H-1' | 'Hari-H'
  ): Promise<{ success: boolean; message: string }> {
    try {
      const result = await this.sendReminder(0, type, {
        activityName,
        activityDate,
        activityTime,
        location: 'Test Location',
        targetNumber: phoneNumber
      });

      return {
        success: true,
        message: `Pengingat ${type} berhasil dikirim ke ${phoneNumber}`
      };
    } catch (error) {
      return {
        success: false,
        message: `Gagal mengirim pengingat: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

export const reminderService = new ReminderService();
export type { ReminderSchedule };
