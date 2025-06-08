
import React from 'react';
import { Activity } from '../services/databaseService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface ActivitiesTableProps {
  activities: Activity[];
}

const ActivitiesTable = ({ activities }: ActivitiesTableProps) => {
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

  return (
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
  );
};

export default ActivitiesTable;
