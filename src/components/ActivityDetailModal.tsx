import React from 'react';
import { Activity } from '../services/databaseService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Badge } from './ui/badge';
import { Calendar, Clock, MapPin, FileText, User, Tag } from 'lucide-react';

interface ActivityDetailModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
}

const ActivityDetailModal = ({ activity, isOpen, onClose }: ActivityDetailModalProps) => {
  if (!activity) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('id-ID');
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      aktif: 'default',
      selesai: 'secondary',
      dibatalkan: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Detail Kegiatan
          </DialogTitle>
          <DialogDescription>
            Informasi lengkap tentang kegiatan ini
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="space-y-3">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {activity.nama_kegiatan}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {activity.jenis_kegiatan}
                </span>
                {getStatusBadge(activity.status)}
              </div>
            </div>
          </div>

          {/* Main Details */}
          <div className="grid gap-4">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900">Tanggal</div>
                <div className="text-gray-600">{formatDate(activity.tanggal)}</div>
                <div className="text-sm text-gray-500">{activity.tanggal}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900">Waktu</div>
                <div className="text-gray-600">{activity.waktu} WIB</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900">Lokasi</div>
                <div className="text-gray-600">{activity.lokasi}</div>
              </div>
            </div>

            {activity.deskripsi && (
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">Deskripsi</div>
                  <div className="text-gray-600 whitespace-pre-wrap">{activity.deskripsi}</div>
                </div>
              </div>
            )}

            {activity.pesan_pengingat && (
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <FileText className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-medium text-green-900">Pesan Pengingat</div>
                  <div className="text-green-700 text-sm whitespace-pre-wrap">
                    {activity.pesan_pengingat}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <User className="w-4 h-4" />
              <span>Dibuat oleh: User ID {activity.created_by}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Dibuat: {formatDateTime(activity.created_at)}</span>
            </div>
            {activity.updated_at !== activity.created_at && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Diperbarui: {formatDateTime(activity.updated_at)}</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityDetailModal;