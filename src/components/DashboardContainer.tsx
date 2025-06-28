import React, { useState, useEffect } from 'react';
import { authService, User } from '../services/authService';
import { databaseService, Activity } from '../services/databaseService';
import { reminderService } from '../services/reminderService';
import { toast } from 'sonner';
import DashboardHeader from './DashboardHeader';
import DashboardTabs from './DashboardTabs';
import { NewActivity } from './AddActivityForm';
import { useNavigate } from 'react-router-dom';

const DashboardContainer = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  // Authentication check - simplified and more reliable
  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        console.log('🔍 DashboardContainer: Starting authentication check...');
        
        // Force a fresh check from localStorage
        authService.refreshUserData();
        
        const currentUser = authService.getCurrentUser();
        const isAuthenticated = authService.isAuthenticated();
        
        console.log('🔍 DashboardContainer auth state:', { 
          currentUser: currentUser?.nama || 'null', 
          isAuthenticated,
          hasToken: !!localStorage.getItem('authToken')
        });
        
        if (!currentUser || !isAuthenticated) {
          console.log('❌ DashboardContainer: User not authenticated, redirecting...');
          authService.logout(); // Clear any corrupted data
          navigate('/login', { replace: true });
          return;
        }
        
        console.log('✅ DashboardContainer: User authenticated successfully');
        setUser(currentUser);
        await loadActivities();
      } catch (error) {
        console.error('❌ DashboardContainer: Error during auth check:', error);
        authService.logout();
        navigate('/login', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndLoadData();
  }, []); // Remove dependency on navigate to prevent re-runs

  useEffect(() => {
    applyFilters();
  }, [activities, filters]);

  const loadActivities = async () => {
    try {
      const result = await databaseService.getActivities();
      if (result.success && result.data) {
        setActivities(result.data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('❌ Error loading activities:', error);
      toast.error('Gagal memuat data kegiatan');
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
    console.log('🚪 DashboardContainer: Logging out user');
    authService.logout();
    toast.success('Berhasil logout');
    navigate('/login', { replace: true });
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

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">Memeriksa autentikasi...</p>
        </div>
      </div>
    );
  }

  // If we reach here, user should be authenticated
  if (!user) {
    console.log('❌ DashboardContainer: No user data available after loading');
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 font-poppins flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Terjadi kesalahan autentikasi</p>
          <button 
            onClick={() => navigate('/login', { replace: true })}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    );
  }

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
