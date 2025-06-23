
import { ScheduledJob, ReminderType } from './types/scheduledJob';

export class JobScheduler {
  private jobs: Map<string, NodeJS.Timeout> = new Map();
  private scheduledJobs: ScheduledJob[] = [];

  scheduleJob(job: ScheduledJob, executeCallback: (job: ScheduledJob) => Promise<void>): void {
    const now = new Date();
    
    if (job.scheduledTime > now) {
      // Set timeout untuk eksekusi
      const timeoutId = setTimeout(async () => {
        await executeCallback(job);
      }, job.scheduledTime.getTime() - now.getTime());

      this.jobs.set(job.id, timeoutId);
      this.scheduledJobs.push(job);
      
      console.log(`✅ Pengingat ${job.type} dijadwalkan untuk ${job.scheduledTime.toLocaleString('id-ID')}`);
      console.log(`📱 Target nomor: ${job.targetNumbers.join(', ')}`);
    }
  }

  cancelJobs(activityId: number): void {
    const types: ReminderType[] = ['H-2', 'H-1', 'Hari-H'];
    
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

  getScheduledJobs(): ScheduledJob[] {
    return this.scheduledJobs.filter(job => job.status === 'scheduled');
  }

  removeJob(jobId: string): void {
    this.jobs.delete(jobId);
  }

  updateJobStatus(jobId: string, status: 'sent' | 'failed'): void {
    const job = this.scheduledJobs.find(j => j.id === jobId);
    if (job) {
      job.status = status;
    }
  }
}
