
import React, { useState } from 'react';
import { Activity } from '../services/databaseService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Calendar, Clock, MapPin, Edit, Trash2, Search, Filter, List, FileText } from 'lucide-react';
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
      aktif: {
        style: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300 shadow-sm',
        icon: '✅',
        text: 'Aktif'
      },
      selesai: {
        style: 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-300 shadow-sm',
        icon: '🎉',
        text: 'Selesai'
      },
      dibatalkan: {
        style: 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-300 shadow-sm',
        icon: '❌',
        text: 'Dibatalkan'
      }
    };
    
    const badge = badges[status as keyof typeof badges];
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border-2 ${badge.style} transition-all duration-200 hover:scale-105`}>
        <span>{badge.icon}</span>
        {badge.text}
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
    <div className="space-y-8">
      {editingActivity && (
        <EditActivityForm
          activity={editingActivity}
          activityTypes={activityTypes}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}

      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-green-50/20 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <List className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Daftar Kegiatan</h3>
                <p className="text-green-100 text-sm font-medium">{activities.length} kegiatan terdaftar</p>
              </div>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-full">
              <span className="font-bold text-lg">{activities.length}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {activities.length === 0 ? (
            <div className="text-center py-16 px-8">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Tidak Ada Kegiatan</h3>
                <p className="text-gray-600">Tidak ada kegiatan yang sesuai dengan filter yang dipilih.</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gradient-to-r from-gray-50 to-green-50">
                  <TableRow className="border-b-2 border-green-100">
                    <TableHead className="font-bold text-gray-800 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-green-600" />
                        Kegiatan
                      </div>
                    </TableHead>
                    <TableHead className="font-bold text-gray-800">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-green-600" />
                        Jenis
                      </div>
                    </TableHead>
                    <TableHead className="font-bold text-gray-800">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                        Tanggal
                      </div>
                    </TableHead>
                    <TableHead className="font-bold text-gray-800">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-600" />
                        Waktu
                      </div>
                    </TableHead>
                    <TableHead className="font-bold text-gray-800">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        Lokasi
                      </div>
                    </TableHead>
                    <TableHead className="font-bold text-gray-800 text-center">Status</TableHead>
                    <TableHead className="font-bold text-gray-800 text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.map((activity, index) => (
                    <TableRow 
                      key={activity.id} 
                      className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      }`}
                    >
                      <TableCell className="font-semibold text-gray-800 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold">{activity.nama_kegiatan}</span>
                          {activity.deskripsi && (
                            <span className="text-sm text-gray-600 mt-1">{activity.deskripsi}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {activity.jenis_kegiatan}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium text-gray-700">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          {new Date(activity.tanggal).toLocaleDateString('id-ID', { 
                            weekday: 'short', 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-gray-700">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          {activity.waktu}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-gray-700">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="max-w-32 truncate">{activity.lokasi}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{getStatusBadge(activity.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(activity)}
                            className="flex items-center gap-1.5 h-9 px-3 border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 font-medium rounded-lg transition-all duration-200 hover:scale-105"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(activity)}
                            className="flex items-center gap-1.5 h-9 px-3 border-2 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 font-medium rounded-lg transition-all duration-200 hover:scale-105"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Hapus
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivitiesTable;
