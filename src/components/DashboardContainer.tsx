
import React, { useState, useEffect } from 'react';
import { authService, User } from '../services/authService';
import { databaseService, Activity } from '../services/databaseService';
import { reminderService } from '../services/reminderService';
import { toast } from 'sonner';
import DashboardHeader from './DashboardHeader';
import DashboardTabs from './DashboardTabs';
import { NewActivity } from './AddActivityForm';

const DashboardContainer = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [filters, setFilters] = useState({
    tanggal: '',
    jenis_kegiatan: '',
    search: ''
  });
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

  useEffect(() => {
    applyFilters();
  }, [activities, filters]);

  const loadActivities = async () => {
    const result = await databaseService.getActivities();
    if (result.success && result.data) {
      setActivities(result.data);
    } else {
      toast.error(result.message);
    }
  };

  const applyFilters = () => {
    let filtered = activities;

    if (filters.tanggal) {
      filtered = filtered.filter(activity => activity.tanggal === filters.tanggal);
    }

    if (filters.jenis_kegiatan) {
      filtered = filtered.filter(activity => activity.jenis_kegiatan === filters.jenis_kegiatan);
    }

    if (filters.search) {
      filtered = filtered.filter(activity =>
        activity.nama_kegiatan.toLowerCase().includes(filters.search.toLowerCase()) ||
        activity.lokasi.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredActivities(filtered);
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
      
      // Jadwalkan pengingat otomatis dengan nomor yang baru
      console.log('🔔 Menjadwalkan pengingat untuk kegiatan:', result.data.nama_kegiatan);
      await reminderService.scheduleReminders({
        activityId: result.data.id,
        activityName: result.data.nama_kegiatan,
        activityDate: result.data.tanggal,
        activityTime: result.data.waktu,
        location: result.data.lokasi,
        targetNumbers: ['6288137216822']
      });
      
      toast.success('✅ Pengingat otomatis telah dijadwalkan ke nomor +62 881-3721-682!');
      
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 font-poppins">
      <DashboardHeader user={user} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardTabs
          activities={activities}
          filteredActivities={filteredActivities}
          filters={filters}
          onFiltersChange={setFilters}
          showAddForm={showAddForm}
          onShowAddForm={setShowAddForm}
          newActivity={newActivity}
          onActivityChange={setNewActivity}
          onAddActivity={handleAddActivity}
          onUpdateActivity={handleUpdateActivity}
          onDeleteActivity={handleDeleteActivity}
          activityTypes={activityTypes}
        />
      </div>
    </div>
  );
};

export default DashboardContainer;
