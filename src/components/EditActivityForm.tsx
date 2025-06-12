
import React, { useState } from 'react';
import { Activity } from '../services/databaseService';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Save, X, Calendar, Clock, MapPin, FileText, Tag } from 'lucide-react';

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
    <Card className="mb-8 shadow-lg border-0 bg-gradient-to-br from-white to-green-50/30 animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-white/20 rounded-lg">
            <FileText className="w-5 h-5" />
          </div>
          Edit Kegiatan
        </CardTitle>
        <CardDescription className="text-green-50">
          Ubah detail kegiatan dan simpan perubahan dengan mudah
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="edit-jenis" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Tag className="w-4 h-4 text-green-600" />
                Jenis Kegiatan
              </Label>
              <select
                id="edit-jenis"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-white shadow-sm"
                value={editedActivity.jenis_kegiatan}
                onChange={(e) => handleInputChange('jenis_kegiatan', e.target.value)}
              >
                {activityTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="edit-nama" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FileText className="w-4 h-4 text-green-600" />
                Nama Kegiatan
              </Label>
              <Input
                id="edit-nama"
                value={editedActivity.nama_kegiatan}
                onChange={(e) => handleInputChange('nama_kegiatan', e.target.value)}
                placeholder="Masukkan nama kegiatan"
                className="h-12 border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 rounded-xl"
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="edit-tanggal" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Calendar className="w-4 h-4 text-green-600" />
                Tanggal
              </Label>
              <Input
                id="edit-tanggal"
                type="date"
                value={editedActivity.tanggal}
                onChange={(e) => handleInputChange('tanggal', e.target.value)}
                className="h-12 border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 rounded-xl"
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="edit-waktu" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Clock className="w-4 h-4 text-green-600" />
                Waktu
              </Label>
              <Input
                id="edit-waktu"
                type="time"
                value={editedActivity.waktu}
                onChange={(e) => handleInputChange('waktu', e.target.value)}
                className="h-12 border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="edit-lokasi" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <MapPin className="w-4 h-4 text-green-600" />
              Lokasi
            </Label>
            <Input
              id="edit-lokasi"
              value={editedActivity.lokasi}
              onChange={(e) => handleInputChange('lokasi', e.target.value)}
              placeholder="Masukkan lokasi kegiatan"
              className="h-12 border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 rounded-xl"
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="edit-deskripsi" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FileText className="w-4 h-4 text-green-600" />
              Deskripsi
            </Label>
            <Input
              id="edit-deskripsi"
              value={editedActivity.deskripsi || ''}
              onChange={(e) => handleInputChange('deskripsi', e.target.value)}
              placeholder="Deskripsi kegiatan (opsional)"
              className="h-12 border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 rounded-xl"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="edit-status" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Tag className="w-4 h-4 text-green-600" />
              Status
            </Label>
            <select
              id="edit-status"
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-white shadow-sm"
              value={editedActivity.status}
              onChange={(e) => handleInputChange('status', e.target.value as 'aktif' | 'selesai' | 'dibatalkan')}
            >
              <option value="aktif">✅ Aktif</option>
              <option value="selesai">🎉 Selesai</option>
              <option value="dibatalkan">❌ Dibatalkan</option>
            </select>
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <Button 
              type="submit" 
              className="flex-1 h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <Save className="w-5 h-5 mr-2" />
              Simpan Perubahan
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="flex-1 h-12 border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 text-gray-700 hover:text-red-600 font-semibold rounded-xl transition-all duration-300"
            >
              <X className="w-5 h-5 mr-2" />
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditActivityForm;
