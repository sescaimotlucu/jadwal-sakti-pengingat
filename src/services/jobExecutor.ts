
import { ScheduledJob } from './types/scheduledJob';

export class JobExecutor {
  static async executeReminderJob(job: ScheduledJob): Promise<void> {
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
    } catch (error) {
      console.error(`❌ Error executing reminder job ${job.id}:`, error);
      job.status = 'failed';
    }
  }
}
