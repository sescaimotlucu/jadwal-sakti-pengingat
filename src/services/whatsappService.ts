
interface WhatsAppMessage {
  number: string;
  message: string;
}

interface WhatsAppResponse {
  success: boolean;
  message: string;
  data?: any;
}

class WhatsAppService {
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:5000') {
    this.baseURL = baseURL;
  }

  async sendMessage(data: WhatsAppMessage): Promise<WhatsAppResponse> {
    try {
      const response = await fetch(`${this.baseURL}/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        message: 'Pesan berhasil dikirim',
        data: result
      };
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Gagal mengirim pesan'
      };
    }
  }

  async sendReminder(
    phoneNumber: string, 
    activity: string, 
    date: string, 
    time: string, 
    type: 'H-2' | 'H-1' | 'Hari-H'
  ): Promise<WhatsAppResponse> {
    let message = '';
    
    switch (type) {
      case 'H-2':
        message = `Hai! Jangan lupa, kegiatan ${activity} akan dilaksanakan pada ${date} jam ${time}. Persiapkan diri Anda ya! 😊`;
        break;
      case 'H-1':
        message = `Reminder: Besok ada kegiatan ${activity} jam ${time}. Jangan sampai terlewat! 📅`;
        break;
      case 'Hari-H':
        message = `Selamat pagi! Hari ini ada kegiatan ${activity} jam ${time}. Sampai jumpa di lokasi! 🌟`;
        break;
    }

    return this.sendMessage({
      number: phoneNumber,
      message: message
    });
  }

  async testConnection(): Promise<WhatsAppResponse> {
    try {
      const response = await fetch(`${this.baseURL}/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        message: 'Koneksi Baileys API berhasil',
        data: result
      };
    } catch (error) {
      console.error('Error testing Baileys connection:', error);
      return {
        success: false,
        message: 'Gagal terhubung ke Baileys API. Pastikan server Node.js berjalan di port 5000'
      };
    }
  }
}

export const whatsappService = new WhatsAppService();
export type { WhatsAppMessage, WhatsAppResponse };
