import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { toast } from 'sonner';
import { Calendar, Clock, MapPin, Edit, Trash2, Plus, Save, X, CheckCircle, Phone } from 'lucide-react';
import { confirmationService } from '../services/confirmationService';
import { reminderService } from '../services/reminderService';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const targetPhoneNumber = '6288137216822'; // +62 881-3721-682

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.date || !formData.time || !formData.location) {
      toast.error('Mohon isi semua field yang diperlukan');
      return;
    }

    setIsSubmitting(true);

    try {
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
        
        console.log(`📋 Kegiatan baru ditambahkan: ${formData.name}`);
        console.log(`📱 Mengirim konfirmasi ke: +62 881-3721-682`);
        
        // Kirim konfirmasi WhatsApp langsung menggunakan reminderService
        try {
          const confirmationResult = await reminderService.sendScheduleConfirmation(
            formData.name!,
            formData.date!,
            formData.time!,
            formData.location!
          );

          if (confirmationResult.success) {
            toast.success('✅ Kegiatan berhasil ditambahkan dan konfirmasi dikirim ke +62 881-3721-682!');
          } else {
            toast.success('Kegiatan berhasil ditambahkan');
            toast.error(`Gagal mengirim konfirmasi: ${confirmationResult.message}`);
          }
        } catch (error) {
          console.error('❌ Error sending confirmation:', error);
          toast.success('Kegiatan berhasil ditambahkan');
          toast.warning('Konfirmasi WhatsApp akan dikirim saat API tersedia');
        }

        // Jadwalkan pengingat otomatis
        try {
          console.log(`🔔 Menjadwalkan pengingat otomatis untuk: ${formData.name}`);
          await reminderService.scheduleReminders({
            activityId: parseInt(newActivity.id),
            activityName: formData.name!,
            activityDate: formData.date!,
            activityTime: formData.time!,
            location: formData.location!,
            targetNumbers: [targetPhoneNumber]
          });
          
          console.log('✅ Pengingat otomatis berhasil dijadwalkan');
          toast.success('🔔 Pengingat otomatis (H-2, H-1, Hari-H) telah dijadwalkan!');
        } catch (error) {
          console.error('❌ Gagal menjadwalkan pengingat:', error);
          toast.warning('Pengingat otomatis akan dijadwalkan saat sistem tersedia');
        }
      }

      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Terjadi kesalahan saat menyimpan kegiatan');
    } finally {
      setIsSubmitting(false);
    }
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
      
      // Batalkan pengingat yang dijadwalkan
      try {
        reminderService.cancelReminders(parseInt(id));
        toast.info('Pengingat untuk kegiatan ini telah dibatalkan');
      } catch (error) {
        console.error('Error cancelling reminders:', error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      upcoming: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300',
      today: 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-300',
      past: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300'
    };
    
    const labels = {
      upcoming: 'Mendatang',
      today: 'Hari Ini',
      past: 'Selesai'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border-2 ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="space-y-6 font-poppins">
      {/* Header */}
      <Card className="border-2 border-emerald-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-yellow-50">
          <CardTitle className="flex items-center gap-2 text-emerald-800">
            <Calendar className="w-5 h-5" />
            Manajemen Jadwal Kegiatan
          </CardTitle>
          <CardDescription className="text-emerald-600">
            Kelola jadwal kegiatan desa dengan konfirmasi dan pengingat otomatis via WhatsApp
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Target Number Info */}
      <Card className="border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-emerald-800">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Target WhatsApp Aktif:</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-700 font-mono text-lg">
              <Phone className="w-4 h-4" />
              <span>+62 881-3721-682</span>
            </div>
          </div>
          <p className="text-emerald-600 text-sm mt-2">
            Semua konfirmasi dan pengingat akan dikirim ke nomor ini secara otomatis
          </p>
        </CardContent>
      </Card>

      {/* Add New Activity Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-emerald-800">Daftar Kegiatan</h3>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
          disabled={isSubmitting}
        >
          <Plus className="w-4 h-4" />
          Tambah Kegiatan
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="border-2 border-emerald-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-yellow-50">
            <CardTitle className="flex items-center justify-between text-emerald-800">
              {isEditing ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}
              <Button variant="ghost" size="sm" onClick={resetForm} disabled={isSubmitting}>
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
            <CardDescription className="text-emerald-600">
              {!isEditing && 'Konfirmasi akan dikirim langsung ke +62 881-3721-682'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-emerald-700 font-medium">Jenis Kegiatan</Label>
                  <select 
                    id="type"
                    className="w-full p-2 border-2 border-emerald-200 rounded-md focus:border-emerald-500"
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    disabled={isSubmitting}
                  >
                    {activityTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {formData.type === 'Lainnya' && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-emerald-700 font-medium">Nama Kegiatan</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Masukkan nama kegiatan"
                      disabled={isSubmitting}
                      required
                      className="border-2 border-emerald-200 focus:border-emerald-500"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="date" className="text-emerald-700 font-medium">Tanggal</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    disabled={isSubmitting}
                    required
                    className="border-2 border-emerald-200 focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time" className="text-emerald-700 font-medium">Waktu</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    disabled={isSubmitting}
                    required
                    className="border-2 border-emerald-200 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-emerald-700 font-medium">Lokasi</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Masukkan lokasi kegiatan"
                  disabled={isSubmitting}
                  required
                  className="border-2 border-emerald-200 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-emerald-700 font-medium">Pesan Pengingat (Opsional)</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Kosongkan untuk menggunakan pesan otomatis"
                  disabled={isSubmitting}
                  rows={3}
                  className="border-2 border-emerald-200 focus:border-emerald-500"
                />
                <p className="text-xs text-emerald-600">
                  Jika dikosongkan, akan menggunakan template pesan otomatis
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
                  disabled={isSubmitting}
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting 
                    ? 'Menyimpan...' 
                    : isEditing 
                      ? 'Perbarui Kegiatan' 
                      : 'Simpan & Kirim Konfirmasi'
                  }
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetForm}
                  disabled={isSubmitting}
                  className="border-2 border-gray-300 hover:bg-gray-50"
                >
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Activities Table */}
      <Card className="border-2 border-emerald-200 shadow-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-emerald-50 to-yellow-50">
                <TableHead className="text-emerald-800 font-semibold">Kegiatan</TableHead>
                <TableHead className="text-emerald-800 font-semibold">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Tanggal
                  </div>
                </TableHead>
                <TableHead className="text-emerald-800 font-semibold">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Waktu
                  </div>
                </TableHead>
                <TableHead className="text-emerald-800 font-semibold">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Lokasi
                  </div>
                </TableHead>
                <TableHead className="text-emerald-800 font-semibold">Status</TableHead>
                <TableHead className="text-emerald-800 font-semibold">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity.id} className="hover:bg-emerald-50">
                  <TableCell className="font-medium text-emerald-800">{activity.name}</TableCell>
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
                        className="flex items-center gap-1 border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                        disabled={isSubmitting}
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(activity.id)}
                        className="flex items-center gap-1 border-2 border-red-300 text-red-700 hover:bg-red-50"
                        disabled={isSubmitting}
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

      {/* Status Information */}
      <Card className="border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="text-emerald-600 text-xl">✅</div>
            <div>
              <h4 className="font-semibold text-emerald-800 mb-1">WhatsApp Integration Active</h4>
              <p className="text-sm text-emerald-700">
                Sistem akan mengirim konfirmasi langsung dan menjadwalkan pengingat otomatis (H-2, H-1, Hari-H) ke nomor <strong>+62 881-3721-682</strong> setiap kali kegiatan baru ditambahkan.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleManager;