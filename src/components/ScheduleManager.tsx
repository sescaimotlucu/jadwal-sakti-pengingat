
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { toast } from 'sonner';
import { Calendar, Clock, MapPin, Edit, Trash2, Plus, Save, X } from 'lucide-react';

interface Activity {
  id: string;
  name: string;
  type: string;
  date: string;
  time: string;
  location: string;
  message: string;
  status: 'upcoming' | 'today' | 'past';
}

const ScheduleManager = () => {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      name: 'Posyandu',
      type: 'Posyandu',
      date: '2024-06-05',
      time: '08:00',
      location: 'Balai Desa',
      message: 'Pengingat Posyandu besok jam 8 pagi di Balai Desa',
      status: 'upcoming'
    },
    {
      id: '2',
      name: 'Pengajian',
      type: 'Pengajian',
      date: '2024-06-03',
      time: '19:30',
      location: 'Masjid Al-Ikhlas',
      message: 'Jangan lupa pengajian malam ini jam 19:30 di Masjid Al-Ikhlas',
      status: 'today'
    }
  ]);

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Activity>>({
    name: '',
    type: 'Posyandu',
    date: '',
    time: '',
    location: '',
    message: ''
  });

  const activityTypes = [
    'Posyandu',
    'Pengajian',
    'Senam',
    'Pertemuan PKK',
    'Rapat RT',
    'Lainnya'
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'Posyandu',
      date: '',
      time: '',
      location: '',
      message: ''
    });
    setShowAddForm(false);
    setIsEditing(null);
  };

  const handleInputChange = (field: keyof Activity, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateAutoMessage = (type: string, date: string, time: string, location: string) => {
    const activityName = type === 'Lainnya' ? formData.name : type;
    return `Pengingat ${activityName} pada tanggal ${date} jam ${time} di ${location}. Mohon hadir tepat waktu.`;
  };

  const getActivityStatus = (date: string): 'upcoming' | 'today' | 'past' => {
    const today = new Date().toISOString().split('T')[0];
    if (date > today) return 'upcoming';
    if (date === today) return 'today';
    return 'past';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.date || !formData.time || !formData.location) {
      toast.error('Mohon isi semua field yang diperlukan');
      return;
    }

    const autoMessage = generateAutoMessage(formData.type!, formData.date!, formData.time!, formData.location!);
    const finalMessage = formData.message || autoMessage;

    if (isEditing) {
      // Update existing activity
      setActivities(prev => prev.map(activity => 
        activity.id === isEditing 
          ? {
              ...activity,
              ...formData,
              message: finalMessage,
              status: getActivityStatus(formData.date!)
            } as Activity
          : activity
      ));
      toast.success('Kegiatan berhasil diperbarui');
    } else {
      // Add new activity
      const newActivity: Activity = {
        id: Date.now().toString(),
        name: formData.name!,
        type: formData.type!,
        date: formData.date!,
        time: formData.time!,
        location: formData.location!,
        message: finalMessage,
        status: getActivityStatus(formData.date!)
      };
      
      setActivities(prev => [...prev, newActivity]);
      toast.success('Kegiatan baru berhasil ditambahkan');
    }

    resetForm();
  };

  const handleEdit = (activity: Activity) => {
    setFormData(activity);
    setIsEditing(activity.id);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) {
      setActivities(prev => prev.filter(activity => activity.id !== id));
      toast.success('Kegiatan berhasil dihapus');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      upcoming: 'bg-blue-100 text-blue-800',
      today: 'bg-green-100 text-green-800',
      past: 'bg-gray-100 text-gray-800'
    };
    
    const labels = {
      upcoming: 'Mendatang',
      today: 'Hari Ini',
      past: 'Selesai'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="space-y-6 font-poppins">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Manajemen Jadwal Kegiatan
          </CardTitle>
          <CardDescription>
            Kelola jadwal kegiatan desa dan pengingat otomatis
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Add New Activity Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Daftar Kegiatan</h3>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Kegiatan
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {isEditing ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Jenis Kegiatan</Label>
                  <select 
                    id="type"
                    className="w-full p-2 border rounded-md"
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                  >
                    {activityTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {formData.type === 'Lainnya' && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Kegiatan</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Masukkan nama kegiatan"
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="date">Tanggal</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Waktu</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Lokasi</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Masukkan lokasi kegiatan"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Pesan Pengingat (Opsional)</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Kosongkan untuk menggunakan pesan otomatis"
                  rows={3}
                />
                <p className="text-xs text-gray-500">
                  Jika dikosongkan, akan menggunakan template pesan otomatis
                </p>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {isEditing ? 'Perbarui' : 'Simpan'} Kegiatan
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Activities Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kegiatan</TableHead>
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
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.name}</TableCell>
                  <TableCell>{activity.date}</TableCell>
                  <TableCell>{activity.time}</TableCell>
                  <TableCell>{activity.location}</TableCell>
                  <TableCell>{getStatusBadge(activity.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(activity)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(activity.id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                        Hapus
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {activities.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Belum ada kegiatan yang ditambahkan
            </div>
          )}
        </CardContent>
      </Card>

      {/* Database Notice */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="text-yellow-600 text-xl">⚠️</div>
            <div>
              <h4 className="font-semibold text-yellow-800 mb-1">Koneksi Database</h4>
              <p className="text-sm text-yellow-700">
                Untuk menyimpan data ke database MySQL, Anda perlu menghubungkan proyek ini ke Supabase. 
                Klik tombol hijau Supabase di bagian kanan atas untuk mengaktifkan integrasi database.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleManager;
