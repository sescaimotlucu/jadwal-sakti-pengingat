
import React from 'react';
import { TableHead, TableHeader, TableRow } from './ui/table';
import { Calendar, Clock, MapPin, Filter, FileText } from 'lucide-react';

const ActivityTableHeader = () => {
  return (
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
  );
};

export default ActivityTableHeader;
