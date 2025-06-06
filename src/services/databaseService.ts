
interface Activity {
  id: number;
  nama_kegiatan: string;
  jenis_kegiatan: string;
  tanggal: string;
  waktu: string;
  lokasi: string;
  deskripsi?: string;
  pesan_pengingat?: string;
  status: 'aktif' | 'selesai' | 'dibatalkan';
  created_by: number;
  created_at: string;
  updated_at: string;
}

interface ReminderLog {
  id: number;
  kegiatan_id: number;
  user_id: number;
  jenis_pengingat: 'H-2' | 'H-1' | 'Hari-H';
  nomor_tujuan: string;
  pesan: string;
  status_kirim: 'pending' | 'terkirim' | 'gagal';
  waktu_kirim?: string;
  response_whatsapp?: string;
  error_message?: string;
  created_at: string;
}

interface DatabaseResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

class DatabaseService {
  private baseURL = 'http://localhost:3001/api';

  // Activities
  async getActivities(filters?: {
    tanggal?: string;
    jenis_kegiatan?: string;
    status?: string;
  }): Promise<DatabaseResponse<Activity[]>> {
    try {
      // Simulate database call with mock data
      const mockActivities: Activity[] = [
        {
          id: 1,
          nama_kegiatan: 'Posyandu Balita',
          jenis_kegiatan: 'Posyandu',
          tanggal: '2024-06-10',
          waktu: '08:00',
          lokasi: 'Balai Desa',
          deskripsi: 'Pemeriksaan kesehatan balita rutin',
          pesan_pengingat: 'Pengingat Posyandu Balita. Mohon hadir tepat waktu dengan membawa KMS balita.',
          status: 'aktif',
          created_by: 1,
          created_at: '2024-06-01T00:00:00Z',
          updated_at: '2024-06-01T00:00:00Z'
        },
        {
          id: 2,
          nama_kegiatan: 'Pengajian Rutin',
          jenis_kegiatan: 'Pengajian',
          tanggal: '2024-06-12',
          waktu: '19:30',
          lokasi: 'Masjid Al-Ikhlas',
          deskripsi: 'Pengajian rutin mingguan',
          pesan_pengingat: 'Pengingat Pengajian Rutin. Mari hadir bersama untuk mendengarkan kajian Islam.',
          status: 'aktif',
          created_by: 1,
          created_at: '2024-06-02T00:00:00Z',
          updated_at: '2024-06-02T00:00:00Z'
        }
      ];

      // Apply filters
      let filteredActivities = mockActivities;
      
      if (filters?.tanggal) {
        filteredActivities = filteredActivities.filter(a => a.tanggal === filters.tanggal);
      }
      
      if (filters?.jenis_kegiatan) {
        filteredActivities = filteredActivities.filter(a => a.jenis_kegiatan === filters.jenis_kegiatan);
      }
      
      if (filters?.status) {
        filteredActivities = filteredActivities.filter(a => a.status === filters.status);
      }

      return {
        success: true,
        message: 'Data kegiatan berhasil dimuat',
        data: filteredActivities
      };
    } catch (error) {
      return {
        success: false,
        message: 'Gagal memuat data kegiatan'
      };
    }
  }

  async addActivity(activity: Omit<Activity, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseResponse<Activity>> {
    try {
      const newActivity: Activity = {
        ...activity,
        id: Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Save to localStorage for demo
      const existingActivities = JSON.parse(localStorage.getItem('activities') || '[]');
      existingActivities.push(newActivity);
      localStorage.setItem('activities', JSON.stringify(existingActivities));

      return {
        success: true,
        message: 'Kegiatan berhasil ditambahkan!',
        data: newActivity
      };
    } catch (error) {
      return {
        success: false,
        message: 'Gagal menambahkan kegiatan'
      };
    }
  }

  async updateActivity(id: number, activity: Partial<Activity>): Promise<DatabaseResponse<Activity>> {
    try {
      // Simulate update
      const updatedActivity: Activity = {
        ...activity,
        updated_at: new Date().toISOString()
      } as Activity;

      return {
        success: true,
        message: 'Kegiatan berhasil diperbarui!',
        data: updatedActivity
      };
    } catch (error) {
      return {
        success: false,
        message: 'Gagal memperbarui kegiatan'
      };
    }
  }

  async deleteActivity(id: number): Promise<DatabaseResponse<void>> {
    try {
      return {
        success: true,
        message: 'Kegiatan berhasil dihapus!'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Gagal menghapus kegiatan'
      };
    }
  }

  // Reminder Logs
  async getReminderLogs(kegiatanId?: number): Promise<DatabaseResponse<ReminderLog[]>> {
    try {
      const mockLogs: ReminderLog[] = [
        {
          id: 1,
          kegiatan_id: 1,
          user_id: 2,
          jenis_pengingat: 'H-2',
          nomor_tujuan: '082115575219',
          pesan: 'Pengingat H-2: Posyandu Balita akan dilaksanakan 2 hari lagi.',
          status_kirim: 'terkirim',
          waktu_kirim: new Date().toISOString(),
          created_at: new Date().toISOString()
        }
      ];

      return {
        success: true,
        message: 'Log pengingat berhasil dimuat',
        data: mockLogs
      };
    } catch (error) {
      return {
        success: false,
        message: 'Gagal memuat log pengingat'
      };
    }
  }

  async addReminderLog(log: Omit<ReminderLog, 'id' | 'created_at'>): Promise<DatabaseResponse<ReminderLog>> {
    try {
      const newLog: ReminderLog = {
        ...log,
        id: Date.now(),
        created_at: new Date().toISOString()
      };

      return {
        success: true,
        message: 'Log pengingat berhasil ditambahkan',
        data: newLog
      };
    } catch (error) {
      return {
        success: false,
        message: 'Gagal menambahkan log pengingat'
      };
    }
  }
}

export const databaseService = new DatabaseService();
export type { Activity, ReminderLog, DatabaseResponse };
