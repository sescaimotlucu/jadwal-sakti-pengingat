import React, { useState } from 'react';
import { Activity } from '../services/databaseService';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Save, X } from 'lucide-react';

interface EditActivityModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedActivity: Activity) => void;
  activityTypes: string[];
}

const EditActivityModal = ({ 
  activity, 
  isOpen, 
  onClose, 
  onSave, 
  activityTypes 
}: EditActivityModalProps) => {
  const [editedActivity, setEditedActivity] = useState<Activity | null>(null);

  React.useEffect(() => {
    if (activity) {
      setEditedActivity({
        ...activity,
        deskripsi: activity.deskripsi || ''
      });
    }
  }, [activity]);

  const handleInputChange = (field: keyof Activity, value: string) => {
    if (!editedActivity) return;
    
    setEditedActivity(prev => ({
      ...prev!,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editedActivity) return;
    
    // Validate required fields
    if (!editedActivity.nama_kegiatan.trim() || 
        !editedActivity.tanggal || 
        !editedActivity.waktu || 
        !editedActivity.lokasi.trim()) {
      alert('Mohon isi semua field yang diperlukan');
      return;
    }
    
    onSave(editedActivity);
    onClose();
  };

  const handleClose = () => {
    setEditedActivity(null);
    onClose();
  };

  if (!editedActivity) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="w-5 h-5" />
            Edit Kegiatan
          </DialogTitle>
          <DialogDescription>
            Ubah detail kegiatan dan simpan perubahan
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-jenis">Jenis Kegiatan</Label>
              <select
                id="edit-jenis"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editedActivity.jenis_kegiatan}
                onChange={(e) => handleInputChange('jenis_kegiatan', e.target.value)}
                required
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
            <Textarea
              id="edit-deskripsi"
              value={editedActivity.deskripsi}
              onChange={(e) => handleInputChange('deskripsi', e.target.value)}
              placeholder="Deskripsi kegiatan (opsional)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-status">Status</Label>
            <select
              id="edit-status"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={editedActivity.status}
              onChange={(e) => handleInputChange('status', e.target.value as 'aktif' | 'selesai' | 'dibatalkan')}
            >
              <option value="aktif">Aktif</option>
              <option value="selesai">Selesai</option>
              <option value="dibatalkan">Dibatalkan</option>
            </select>
          </div>

          <DialogFooter className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              <X className="w-4 h-4 mr-2" />
              Batal
            </Button>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditActivityModal;