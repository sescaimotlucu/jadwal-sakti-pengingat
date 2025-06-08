
import React, { useState } from 'react';
import { Activity } from '../services/databaseService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Calendar, Clock, MapPin, Edit, Trash2 } from 'lucide-react';
import EditActivityForm from './EditActivityForm';

interface ActivitiesTableProps {
  activities: Activity[];
  activityTypes: string[];
  onUpdateActivity: (activity: Activity) => void;
  onDeleteActivity: (id: number) => void;
}

const ActivitiesTable = ({ activities, activityTypes, onUpdateActivity, onDeleteActivity }: ActivitiesTableProps) => {
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

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

  const handleEdit = (activity: Activity) => {
    console.log('🖊️ Editing activity:', activity.nama_kegiatan);
    setEditingActivity(activity);
  };

  const handleSaveEdit = (updatedActivity: Activity) => {
    console.log('💾 Saving activity:', updatedActivity.nama_kegiatan);
    onUpdateActivity(updatedActivity);
    setEditingActivity(null);
  };

  const handleCancelEdit = () => {
    console.log('❌ Cancelling edit');
    setEditingActivity(null);
  };

  const handleDelete = (activity: Activity) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus kegiatan "${activity.nama_kegiatan}"?`)) {
      console.log('🗑️ Deleting activity:', activity.nama_kegiatan);
      onDeleteActivity(activity.id);
    }
  };

  return (
    <div className="space-y-6">
      {editingActivity && (
        <EditActivityForm
          activity={editingActivity}
          activityTypes={activityTypes}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Daftar Kegiatan ({activities.length})</CardTitle>
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
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.nama_kegiatan}</TableCell>
                  <TableCell>{activity.jenis_kegiatan}</TableCell>
                  <TableCell>{activity.tanggal}</TableCell>
                  <TableCell>{activity.waktu}</TableCell>
                  <TableCell>{activity.lokasi}</TableCell>
                  <TableCell>{getStatusBadge(activity.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(activity)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(activity)}
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
              Tidak ada kegiatan yang sesuai dengan filter
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivitiesTable;
