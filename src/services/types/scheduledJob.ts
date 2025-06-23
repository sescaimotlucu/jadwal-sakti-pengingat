
export interface ScheduledJob {
  id: string;
  activityId: number;
  type: 'H-2' | 'H-1' | 'Hari-H';
  scheduledTime: Date;
  targetNumbers: string[];
  message: string;
  status: 'scheduled' | 'sent' | 'failed';
}

export interface ActivityDetails {
  activityName: string;
  activityDate: string;
  activityTime: string;
  location: string;
}

export type ReminderType = 'H-2' | 'H-1' | 'Hari-H';
