
import React from 'react';
import { Activity } from '../services/databaseService';
import { TableCell, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Calendar, Clock, MapPin, Edit, Trash2 } from 'lucide-react';
import ActivityStatusBadge from './ActivityStatusBadge';

interface ActivityRowProps {
  activity: Activity;
  index: number;
  onEdit: (activity: Activity) => void;
  onDelete: (activity: Activity) => void;
}

const ActivityRow = ({ activity, index, onEdit, onDelete }: ActivityRowProps) => {
  const handleEdit = () => {
    console.log('🖊️ Editing activity:', activity.nama_kegiatan);
    onEdit(activity);
  };

  const handleDelete = () => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus kegiatan "${activity.nama_kegiatan}"?`)) {
      console.log('🗑️ Deleting activity:', activity.nama_kegiatan);
      onDelete(activity);
    }
  };

  return (
    <TableRow 
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
      <TableCell className="text-center">
        <ActivityStatusBadge status={activity.status} />
      </TableCell>
      <TableCell>
        <div className="flex gap-2 justify-center">
          <Button
            size="sm"
            variant="outline"
            onClick={handleEdit}
            className="flex items-center gap-1.5 h-9 px-3 border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 font-medium rounded-lg transition-all duration-200 hover:scale-105"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDelete}
            className="flex items-center gap-1.5 h-9 px-3 border-2 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 font-medium rounded-lg transition-all duration-200 hover:scale-105"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Hapus
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ActivityRow;
