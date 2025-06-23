
import { ReminderType, ActivityDetails } from './types/scheduledJob';

export class MessageBuilder {
  static createMessage(type: ReminderType, details: ActivityDetails): string {
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
}
