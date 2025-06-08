
import { useState, useEffect } from 'react';
import { authService, User } from '../services/authService';
import { databaseService, Activity } from '../services/databaseService';
import { reminderService } from '../services/reminderService';
import { toast } from 'sonner';
import { NewActivity } from '../components/AddActivityForm';

export const useDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newActivity, setNewActivity] = useState<NewActivity>({
    nama_kegiatan: '',
    jenis_kegiatan: 'Posyandu',
    tanggal: '',
    waktu: '',
    lokasi: '',
    deskripsi: '',
    pesan_pengingat: ''
  });

  const activityTypes = [
    'Posyandu',
    'Pengajian',
    'Senam',
    'Pertemuan PKK',
    'Rapat RT',
    'Lainnya'
  ];

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      window.location.href = '/login';
      return;
    }
    setUser(currentUser);
    loadActivities();
  }, []);

  const loadActivities = async () => {
    const result = await databaseService.getActivities();
    if (result.success && result.data) {
      setActivities(result.data);
    } else {
      toast.error(result.message);
    }
  };

  const handleLogout = () => {
    authService.logout();
    toast.success('Berhasil logout');
    window.location.href = '/login';
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newActivity.nama_kegiatan || !newActivity.tanggal || !newActivity.waktu || !newActivity.lokasi) {
      toast.error('Mohon isi semua field yang diperlukan');
      return;
    }

    const result = await databaseService.addActivity({
      ...newActivity,
      status: 'aktif',
      created_by: user?.id || 1
    });

    if (result.success && result.data) {
      toast.success(result.message);
      setActivities(prev => [...prev, result.data!]);
      
      // Jadwalkan pengingat otomatis dengan nomor target yang ditentukan
      console.log('🔔 Menjadwalkan pengingat untuk kegiatan:', result.data.nama_kegiatan);
      await reminderService.scheduleReminders({
        activityId: result.data.id,
        activityName: result.data.nama_kegiatan,
        activityDate: result.data.tanggal,
        activityTime: result.data.waktu,
        location: result.data.lokasi,
        targetNumbers: ['082115575219'] // Pastikan menggunakan nomor yang benar
      });
      
      toast.success('✅ Pengingat otomatis telah dijadwalkan ke nomor 082115575219!');
      
      // Reset form
      setNewActivity({
        nama_kegiatan: '',
        jenis_kegiatan: 'Posyandu',
        tanggal: '',
        waktu: '',
        lokasi: '',
        deskripsi: '',
        pesan_pengingat: ''
      });
      setShowAddForm(false);
    } else {
      toast.error(result.message);
    }
  };

  const handleUpdateActivity = async (updatedActivity: Activity) => {
    console.log('🔄 Updating activity:', updatedActivity.nama_kegiatan);
    
    const result = await databaseService.updateActivity(updatedActivity.id, updatedActivity);
    
    if (result.success) {
      toast.success('Kegiatan berhasil diperbarui!');
      setActivities(prev => 
        prev.map(activity => 
          activity.id === updatedActivity.id ? updatedActivity : activity
        )
      );
    } else {
      toast.error(result.message);
    }
  };

  const handleDeleteActivity = async (activityId: number) => {
    console.log('🗑️ Deleting activity ID:', activityId);
    
    const result = await databaseService.deleteActivity(activityId);
    
    if (result.success) {
      toast.success('Kegiatan berhasil dihapus!');
      setActivities(prev => prev.filter(activity => activity.id !== activityId));
      
      // Batalkan pengingat yang dijadwalkan
      reminderService.cancelReminders(activityId);
      toast.info('Pengingat untuk kegiatan ini telah dibatalkan');
    } else {
      toast.error(result.message);
    }
  };

  return {
    user,
    activities,
    showAddForm,
    newActivity,
    activityTypes,
    setShowAddForm,
    setNewActivity,
    handleLogout,
    handleAddActivity,
    handleUpdateActivity,
    handleDeleteActivity
  };
};
