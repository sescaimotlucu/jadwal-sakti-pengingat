import React, { useState } from 'react';
import { Activity } from '../services/databaseService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Calendar, Clock, MapPin, Edit, Trash2, Eye } from 'lucide-react';
import EditActivityModal from './EditActivityModal';
import ActivityDetailModal from './ActivityDetailModal';

interface ActivitiesTableProps {
  activities: Activity[];
  activityTypes: string[];
  onUpdateActivity: (activity: Activity) => void;
  onDeleteActivity: (id: number) => void;
}

const ActivitiesTable = ({ activities, activityTypes, onUpdateActivity, onDeleteActivity }: ActivitiesTableProps) => {
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [viewingActivity, setViewingActivity] = useState<Activity | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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
    console.log('🖊️ Starting edit for activity:', activity.nama_kegiatan);
    setEditingActivity(activity);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedActivity: Activity) => {
    console.log('💾 Saving updated activity:', updatedActivity);
    onUpdateActivity(updatedActivity);
    setIsEditModalOpen(false);
    setEditingActivity(null);
  };

  const handleCancelEdit = () => {
    console.log('❌ Cancelling edit');
    setIsEditModalOpen(false);
    setEditingActivity(null);
  };

  const handleView = (activity: Activity) => {
    setViewingActivity(activity);
    setIsDetailModalOpen(true);
  };

  const handleDelete = (activity: Activity) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus kegiatan "${activity.nama_kegiatan}"?`)) {
      console.log('🗑️ Deleting activity:', activity.nama_kegiatan);
      onDeleteActivity(activity.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Daftar Kegiatan ({activities.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kegiatan</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Tanggal
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Waktu
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Lokasi
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{activity.nama_kegiatan}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {activity.jenis_kegiatan}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{activity.tanggal}</div>
                        <div className="text-gray-500 text-xs">
                          {formatDate(activity.tanggal)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{activity.waktu}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{activity.lokasi}</TableCell>
                    <TableCell>{getStatusBadge(activity.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(activity)}
                          className="flex items-center gap-1"
                          title="Lihat Detail"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(activity)}
                          className="flex items-center gap-1"
                          title="Edit Kegiatan"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(activity)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-700"
                          title="Hapus Kegiatan"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {activities.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Tidak ada kegiatan yang sesuai dengan filter</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <EditActivityModal
        activity={editingActivity}
        isOpen={isEditModalOpen}
        onClose={handleCancelEdit}
        onSave={handleSaveEdit}
        activityTypes={activityTypes}
      />

      {/* Detail Modal */}
      <ActivityDetailModal
        activity={viewingActivity}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setViewingActivity(null);
        }}
      />
    </div>
  );
};

export default ActivitiesTable;