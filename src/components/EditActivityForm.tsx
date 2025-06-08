
import React, { useState } from 'react';
import { Activity } from '../services/databaseService';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Save, X } from 'lucide-react';

interface EditActivityFormProps {
  activity: Activity;
  activityTypes: string[];
  onSave: (updatedActivity: Activity) => void;
  onCancel: () => void;
}

const EditActivityForm = ({ activity, activityTypes, onSave, onCancel }: EditActivityFormProps) => {
  const [editedActivity, setEditedActivity] = useState<Activity>(activity);

  const handleInputChange = (field: keyof Activity, value: string) => {
    setEditedActivity({ ...editedActivity, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedActivity);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Edit Kegiatan</CardTitle>
        <CardDescription>
          Ubah detail kegiatan dan simpan perubahan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-jenis">Jenis Kegiatan</Label>
              <select
                id="edit-jenis"
                className="w-full p-2 border rounded-md"
                value={editedActivity.jenis_kegiatan}
                onChange={(e) => handleInputChange('jenis_kegiatan', e.target.value)}
              >
                {activityTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-nama">Nama Kegiatan</Label>
              <Input
                id="edit-nama"
                value={editedActivity.nama_kegiatan}
                onChange={(e) => handleInputChange('nama_kegiatan', e.target.value)}
                placeholder="Masukkan nama kegiatan"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-tanggal">Tanggal</Label>
              <Input
                id="edit-tanggal"
                type="date"
                value={editedActivity.tanggal}
                onChange={(e) => handleInputChange('tanggal', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-waktu">Waktu</Label>
              <Input
                id="edit-waktu"
                type="time"
                value={editedActivity.waktu}
                onChange={(e) => handleInputChange('waktu', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-lokasi">Lokasi</Label>
            <Input
              id="edit-lokasi"
              value={editedActivity.lokasi}
              onChange={(e) => handleInputChange('lokasi', e.target.value)}
              placeholder="Masukkan lokasi kegiatan"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-deskripsi">Deskripsi</Label>
            <Input
              id="edit-deskripsi"
              value={editedActivity.deskripsi || ''}
              onChange={(e) => handleInputChange('deskripsi', e.target.value)}
              placeholder="Deskripsi kegiatan (opsional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-status">Status</Label>
            <select
              id="edit-status"
              className="w-full p-2 border rounded-md"
              value={editedActivity.status}
              onChange={(e) => handleInputChange('status', e.target.value as 'aktif' | 'selesai' | 'dibatalkan')}
            >
              <option value="aktif">Aktif</option>
              <option value="selesai">Selesai</option>
              <option value="dibatalkan">Dibatalkan</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Simpan Perubahan
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditActivityForm;
