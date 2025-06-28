
import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Plus } from 'lucide-react';

interface NewActivity {
  nama_kegiatan: string;
  jenis_kegiatan: string;
  tanggal: string;
  waktu: string;
  lokasi: string;
  deskripsi: string;
  pesan_pengingat: string;
}

interface AddActivityFormProps {
  showForm: boolean;
  newActivity: NewActivity;
  onActivityChange: (activity: NewActivity) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  activityTypes: string[];
  isSubmitting?: boolean;
}

const AddActivityForm = ({ 
  showForm, 
  newActivity, 
  onActivityChange, 
  onSubmit, 
  onCancel, 
  activityTypes,
  isSubmitting = false
}: AddActivityFormProps) => {
  if (!showForm) return null;

  const handleInputChange = (field: keyof NewActivity, value: string) => {
    onActivityChange({ ...newActivity, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tambah Kegiatan Baru</CardTitle>
        <CardDescription>
          Konfirmasi dan pengingat otomatis akan dikirim ke nomor +62 881-3721-682
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jenis">Jenis Kegiatan</Label>
              <select
                id="jenis"
                className="w-full p-2 border rounded-md"
                value={newActivity.jenis_kegiatan}
                onChange={(e) => handleInputChange('jenis_kegiatan', e.target.value)}
                disabled={isSubmitting}
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
                onChange={(e) => handleInputChange('nama_kegiatan', e.target.value)}
                placeholder="Masukkan nama kegiatan"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tanggal">Tanggal</Label>
              <Input
                id="tanggal"
                type="date"
                value={newActivity.tanggal}
                onChange={(e) => handleInputChange('tanggal', e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="waktu">Waktu</Label>
              <Input
                id="waktu"
                type="time"
                value={newActivity.waktu}
                onChange={(e) => handleInputChange('waktu', e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lokasi">Lokasi</Label>
            <Input
              id="lokasi"
              value={newActivity.lokasi}
              onChange={(e) => handleInputChange('lokasi', e.target.value)}
              placeholder="Masukkan lokasi kegiatan"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button 
              type="submit" 
              className="flex items-center gap-2"
              disabled={isSubmitting}
            >
              <Plus className="w-4 h-4" />
              {isSubmitting ? 'Menyimpan...' : 'Simpan & Kirim Konfirmasi'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddActivityForm;
export type { NewActivity };
