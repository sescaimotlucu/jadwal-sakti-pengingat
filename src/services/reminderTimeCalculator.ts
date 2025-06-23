
import { ReminderType } from './types/scheduledJob';

export class ReminderTimeCalculator {
  static calculateReminderTimes(activityDate: string, activityTime: string): Record<ReminderType, Date> {
    const activityDateTime = new Date(`${activityDate}T${activityTime}`);
    
    return {
      'H-2': new Date(activityDateTime.getTime() - (2 * 24 * 60 * 60 * 1000)),
      'H-1': new Date(activityDateTime.getTime() - (1 * 24 * 60 * 60 * 1000)),
      'Hari-H': new Date(activityDateTime.getTime() - (2 * 60 * 60 * 1000)) // 2 jam sebelum
    };
  }
}
