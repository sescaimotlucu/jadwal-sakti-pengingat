
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
  // Jadwalkan pengingat otomatis
  async scheduleReminders(schedule: ReminderSchedule): Promise<void> {
    const { 
      activityId, 
      activityName, 
      activityDate, 
      activityTime, 
      location, 
      targetNumbers = ['082115575219'] // Default ke nomor yang ditentukan
    } = schedule;

    console.log(`📋 Menjadwalkan pengingat untuk kegiatan: ${activityName}`);
    console.log(`📱 Target nomor: ${targetNumbers.join(', ')}`);

    // Gunakan cronJobService untuk penjadwalan yang lebih reliable
    cronJobService.scheduleReminder(
      activityId,
      activityName,
      activityDate,
      activityTime,
      location,
      targetNumbers
    );
  }

  // Batalkan pengingat
  cancelReminders(activityId: number): void {
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
    
    return await cronJobService.testReminder(phoneNumber, activityName, type);
  }

  // Dapatkan status pengingat yang dijadwalkan
  getScheduledReminders() {
    return cronJobService.getScheduledJobs();
  }
}

export const reminderService = new ReminderService();
export type { ReminderSchedule };
