
import React, { useState, useEffect } from 'react';
import { authService, User } from '../services/authService';
import { databaseService, Activity } from '../services/databaseService';
import { reminderService } from '../services/reminderService';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';
import { LogOut, Calendar, Clock, MapPin, Plus, Search, Filter, Send, User as UserIcon } from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [filters, setFilters] = useState({
    tanggal: '',
    jenis_kegiatan: '',
    search: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newActivity, setNewActivity] = useState({
    nama_kegiatan: '',
    jenis_kegiatan: 'Posyandu',
    tanggal: '',
    waktu: '',
    lokasi: '',
    deskripsi: '',
    pesan_pengingat: ''
  });
  const [testReminder, setTestReminder] = useState({
    phoneNumber: '082115575219',
    activityName: 'Test Activity',
    activityDate: '',
    activityTime: '',
    type: 'H-1' as 'H-2' | 'H-1' | 'Hari-H'
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
      
      // Schedule reminders
      await reminderService.scheduleReminders({
        activityId: result.data.id,
        activityName: result.data.nama_kegiatan,
        activityDate: result.data.tanggal,
        activityTime: result.data.waktu,
        location: result.data.lokasi,
        targetNumber: '082115575219'
      });
      
      toast.success('Pengingat otomatis telah dijadwalkan!');
      
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

  const handleTestReminder = async () => {
    if (!testReminder.phoneNumber || !testReminder.activityName) {
      toast.error('Mohon isi semua field test reminder');
      return;
    }

    const result = await reminderService.sendTestReminder(
      testReminder.phoneNumber,
      testReminder.activityName,
      testReminder.activityDate || new Date().toISOString().split('T')[0],
      testReminder.activityTime || '10:00',
      testReminder.type
    );

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      aktif: 'bg-green-100 text-green-800 border-green-200',
      selesai: 'bg-gray-100 text-gray-800 border-gray-200',
      dibatalkan: 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${badges[status as keyof typeof badges]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 font-poppins">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-yellow-300 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sistem Pengingat Jadwal</h1>
                <p className="text-sm text-gray-600">Dashboard Manajemen Kegiatan</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-700">
                <UserIcon className="w-4 h-4" />
                <span className="text-sm font-medium">{user?.nama}</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{user?.role}</span>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="activities" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="activities">Kelola Kegiatan</TabsTrigger>
            <TabsTrigger value="reminders">Test Pengingat</TabsTrigger>
            <TabsTrigger value="stats">Statistik</TabsTrigger>
          </TabsList>

          {/* Activities Management */}
          <TabsContent value="activities" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filter & Pencarian
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">Cari Kegiatan</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Nama kegiatan atau lokasi..."
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date-filter">Filter Tanggal</Label>
                    <Input
                      id="date-filter"
                      type="date"
                      value={filters.tanggal}
                      onChange={(e) => setFilters(prev => ({ ...prev, tanggal: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type-filter">Filter Jenis</Label>
                    <select
                      id="type-filter"
                      className="w-full p-2 border rounded-md"
                      value={filters.jenis_kegiatan}
                      onChange={(e) => setFilters(prev => ({ ...prev, jenis_kegiatan: e.target.value }))}
                    >
                      <option value="">Semua Jenis</option>
                      {activityTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>&nbsp;</Label>
                    <Button
                      onClick={() => setShowAddForm(true)}
                      className="w-full flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Tambah Kegiatan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add Activity Form */}
            {showAddForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Tambah Kegiatan Baru</CardTitle>
                  <CardDescription>
                    Masukkan detail kegiatan dan pengingat otomatis akan dijadwalkan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddActivity} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="jenis">Jenis Kegiatan</Label>
                        <select
                          id="jenis"
                          className="w-full p-2 border rounded-md"
                          value={newActivity.jenis_kegiatan}
                          onChange={(e) => setNewActivity(prev => ({ ...prev, jenis_kegiatan: e.target.value }))}
                        >
                          {activityTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nama">Nama Kegiatan</Label>
                        <Input
                          id="nama"
                          value={newActivity.nama_kegiatan}
                          onChange={(e) => setNewActivity(prev => ({ ...prev, nama_kegiatan: e.target.value }))}
                          placeholder="Masukkan nama kegiatan"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tanggal">Tanggal</Label>
                        <Input
                          id="tanggal"
                          type="date"
                          value={newActivity.tanggal}
                          onChange={(e) => setNewActivity(prev => ({ ...prev, tanggal: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="waktu">Waktu</Label>
                        <Input
                          id="waktu"
                          type="time"
                          value={newActivity.waktu}
                          onChange={(e) => setNewActivity(prev => ({ ...prev, waktu: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lokasi">Lokasi</Label>
                      <Input
                        id="lokasi"
                        value={newActivity.lokasi}
                        onChange={(e) => setNewActivity(prev => ({ ...prev, lokasi: e.target.value }))}
                        placeholder="Masukkan lokasi kegiatan"
                        required
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Simpan Kegiatan
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowAddForm(false)}
                      >
                        Batal
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Activities Table */}
            <Card>
              <CardHeader>
                <CardTitle>Daftar Kegiatan ({filteredActivities.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kegiatan</TableHead>
                      <TableHead>Jenis</TableHead>
                      <TableHead className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Tanggal
                      </TableHead>
                      <TableHead className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Waktu
                      </TableHead>
                      <TableHead className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        Lokasi
                      </TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActivities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-medium">{activity.nama_kegiatan}</TableCell>
                        <TableCell>{activity.jenis_kegiatan}</TableCell>
                        <TableCell>{activity.tanggal}</TableCell>
                        <TableCell>{activity.waktu}</TableCell>
                        <TableCell>{activity.lokasi}</TableCell>
                        <TableCell>{getStatusBadge(activity.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredActivities.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    {filters.search || filters.tanggal || filters.jenis_kegiatan 
                      ? 'Tidak ada kegiatan yang sesuai dengan filter'
                      : 'Belum ada kegiatan yang ditambahkan'
                    }
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Test Reminders */}
          <TabsContent value="reminders">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Test Pengingat WhatsApp
                </CardTitle>
                <CardDescription>
                  Kirim pengingat test ke nomor 082115575219
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="test-phone">Nomor WhatsApp</Label>
                    <Input
                      id="test-phone"
                      value={testReminder.phoneNumber}
                      onChange={(e) => setTestReminder(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      placeholder="082115575219"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="test-activity">Nama Kegiatan</Label>
                    <Input
                      id="test-activity"
                      value={testReminder.activityName}
                      onChange={(e) => setTestReminder(prev => ({ ...prev, activityName: e.target.value }))}
                      placeholder="Posyandu Balita"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="test-date">Tanggal</Label>
                    <Input
                      id="test-date"
                      type="date"
                      value={testReminder.activityDate}
                      onChange={(e) => setTestReminder(prev => ({ ...prev, activityDate: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="test-time">Waktu</Label>
                    <Input
                      id="test-time"
                      type="time"
                      value={testReminder.activityTime}
                      onChange={(e) => setTestReminder(prev => ({ ...prev, activityTime: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="test-type">Jenis Pengingat</Label>
                  <select
                    id="test-type"
                    className="w-full p-2 border rounded-md"
                    value={testReminder.type}
                    onChange={(e) => setTestReminder(prev => ({ ...prev, type: e.target.value as 'H-2' | 'H-1' | 'Hari-H' }))}
                  >
                    <option value="H-2">H-2 (2 hari sebelum)</option>
                    <option value="H-1">H-1 (1 hari sebelum)</option>
                    <option value="Hari-H">Hari-H (hari kegiatan)</option>
                  </select>
                </div>

                <Button onClick={handleTestReminder} className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Kirim Test Pengingat
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics */}
          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Kegiatan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{activities.length}</div>
                  <p className="text-sm text-gray-600">Kegiatan terdaftar</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Kegiatan Aktif</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {activities.filter(a => a.status === 'aktif').length}
                  </div>
                  <p className="text-sm text-gray-600">Sedang berjalan</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pengingat Aktif</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600">
                    {activities.filter(a => a.status === 'aktif').length * 3}
                  </div>
                  <p className="text-sm text-gray-600">H-2, H-1, Hari-H</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
