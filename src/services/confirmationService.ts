
import { whatsappService } from './whatsappService';

interface ConfirmationDetails {
  activityName: string;
  activityDate: string;
  activityTime: string;
  location: string;
}

class ConfirmationService {
  async sendScheduleConfirmation(
    phoneNumber: string,
    details: ConfirmationDetails
  ): Promise<{ success: boolean; message: string }> {
    const { activityName, activityDate, activityTime, location } = details;
    
    const formattedDate = new Date(activityDate).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const confirmationMessage = `✅ *KONFIRMASI JADWAL KEGIATAN*

Assalamualaikum Wr. Wb.

Kegiatan *${activityName}* telah berhasil dijadwalkan:

📅 *Hari/Tanggal:* ${formattedDate}
🕐 *Waktu:* ${activityTime} WIB
📍 *Tempat:* ${location}

🔔 *Pengingat Otomatis:*
• H-2: Dua hari sebelum kegiatan
• H-1: Satu hari sebelum kegiatan  
• Hari-H: Pada hari kegiatan (2 jam sebelum)

Terima kasih! 😊

Wassalamualaikum Wr. Wb.

_Sistem Pengingat Otomatis Desa_`;

    console.log(`📤 Mengirim konfirmasi jadwal ke ${phoneNumber}`);
    
    try {
      const result = await whatsappService.sendMessage({
        number: phoneNumber,
        message: confirmationMessage
      });

      if (result.success) {
        console.log(`✅ Konfirmasi jadwal berhasil dikirim ke ${phoneNumber}`);
        return {
          success: true,
          message: `Konfirmasi jadwal berhasil dikirim ke ${phoneNumber}`
        };
      } else {
        console.error(`❌ Gagal mengirim konfirmasi jadwal:`, result.message);
        return {
          success: false,
          message: `Gagal mengirim konfirmasi: ${result.message}`
        };
      }
    } catch (error) {
      console.error('❌ Error sending schedule confirmation:', error);
      return {
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

export const confirmationService = new ConfirmationService();
