
import { ScheduledJob, ActivityDetails, ReminderType } from './types/scheduledJob';
import { MessageBuilder } from './messageBuilder';
import { JobScheduler } from './jobScheduler';
import { JobExecutor } from './jobExecutor';
import { ReminderTimeCalculator } from './reminderTimeCalculator';

class CronJobService {
  private jobScheduler = new JobScheduler();

  // Pastikan pesan terkirim ke nomor yang tepat
  scheduleReminder(
    activityId: number,
    activityName: string,
    activityDate: string,
    activityTime: string,
    location: string,
    targetNumbers: string[] = ['6288137216822'] // Updated to your number
  ): void {
    // Hitung waktu pengingat
    const reminderTimes = ReminderTimeCalculator.calculateReminderTimes(activityDate, activityTime);
    const now = new Date();

    // Jadwalkan setiap jenis pengingat
    Object.entries(reminderTimes).forEach(([type, scheduledTime]) => {
      if (scheduledTime > now) {
        const jobId = `${activityId}-${type}`;
        
        // Buat pesan berdasarkan jenis pengingat
        const message = MessageBuilder.createMessage(type as ReminderType, {
          activityName,
          activityDate,
          activityTime,
          location
        });

        // Simpan job yang dijadwalkan
        const scheduledJob: ScheduledJob = {
          id: jobId,
          activityId,
          type: type as ReminderType,
          scheduledTime,
          targetNumbers,
          message,
          status: 'scheduled'
        };
        
        // Jadwalkan job dengan callback untuk eksekusi
        this.jobScheduler.scheduleJob(scheduledJob, async (job) => {
          await JobExecutor.executeReminderJob(job);
          this.jobScheduler.removeJob(job.id);
        });
      }
    });
  }

  // Batalkan pengingat untuk kegiatan tertentu
  cancelReminders(activityId: number): void {
    this.jobScheduler.cancelJobs(activityId);
  }

  // Dapatkan daftar job yang dijadwalkan
  getScheduledJobs(): ScheduledJob[] {
    return this.jobScheduler.getScheduledJobs();
  }

  // Test manual pengiriman
  async testReminder(
    phoneNumber: string,
    activityName: string,
    type: ReminderType
  ): Promise<{ success: boolean; message: string }> {
    try {
      const testMessage = MessageBuilder.createMessage(type, {
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
