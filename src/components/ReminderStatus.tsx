
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { cronJobService, ScheduledJob } from '../services/cronJobService';
import { reminderService } from '../services/reminderService';
import { toast } from 'sonner';
import { Clock, Send, CheckCircle, XCircle, Calendar, Phone } from 'lucide-react';

const ReminderStatus = () => {
  const [scheduledJobs, setScheduledJobs] = useState<ScheduledJob[]>([]);
  const [testData, setTestData] = useState({
    phoneNumber: '082115575219',
    activityName: 'Test Kegiatan',
    type: 'H-1' as 'H-2' | 'H-1' | 'Hari-H'
  });

  useEffect(() => {
    loadScheduledJobs();
    const interval = setInterval(loadScheduledJobs, 5000); // Refresh setiap 5 detik
    return () => clearInterval(interval);
  }, []);

  const loadScheduledJobs = () => {
    const jobs = cronJobService.getScheduledJobs();
    setScheduledJobs(jobs);
  };

  const handleTestReminder = async () => {
    if (!testData.phoneNumber || !testData.activityName) {
      toast.error('Mohon isi nomor WhatsApp dan nama kegiatan');
      return;
    }

    const result = await reminderService.sendTestReminder(
      testData.phoneNumber,
      testData.activityName,
      new Date().toISOString().split('T')[0],
      '10:00',
      testData.type
    );

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: 'default',
      sent: 'default',
      failed: 'destructive'
    } as const;

    const icons = {
      scheduled: <Clock className="w-3 h-3" />,
      sent: <CheckCircle className="w-3 h-3" />,
      failed: <XCircle className="w-3 h-3" />
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]} className="flex items-center gap-1">
        {icons[status as keyof typeof icons]}
        {status === 'scheduled' ? 'Terjadwal' : status === 'sent' ? 'Terkirim' : 'Gagal'}
      </Badge>
    );
  };

  const formatReminderType = (type: string) => {
    const types = {
      'H-2': '2 Hari Sebelum',
      'H-1': '1 Hari Sebelum',
      'Hari-H': 'Hari Kegiatan'
    };
    return types[type as keyof typeof types] || type;
  };

  return (
    <div className="space-y-6">
      {/* Test Reminder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Test Pengiriman Pengingat
          </CardTitle>
          <CardDescription>
            Kirim pengingat test ke nomor WhatsApp yang ditentukan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="test-phone">Nomor WhatsApp</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="test-phone"
                  value={testData.phoneNumber}
                  onChange={(e) => setTestData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="082115575219"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="test-activity">Nama Kegiatan</Label>
              <Input
                id="test-activity"
                value={testData.activityName}
                onChange={(e) => setTestData(prev => ({ ...prev, activityName: e.target.value }))}
                placeholder="Posyandu Balita"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="test-type">Jenis Pengingat</Label>
              <select
                id="test-type"
                className="w-full p-2 border rounded-md"
                value={testData.type}
                onChange={(e) => setTestData(prev => ({ ...prev, type: e.target.value as 'H-2' | 'H-1' | 'Hari-H' }))}
              >
                <option value="H-2">H-2 (2 hari sebelum)</option>
                <option value="H-1">H-1 (1 hari sebelum)</option>
                <option value="Hari-H">Hari-H (hari kegiatan)</option>
              </select>
            </div>
          </div>

          <Button onClick={handleTestReminder} className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Kirim Test Pengingat
          </Button>
        </CardContent>
      </Card>

      {/* Scheduled Jobs Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Status Pengingat Terjadwal ({scheduledJobs.length})
          </CardTitle>
          <CardDescription>
            Daftar pengingat yang sudah dijadwalkan dan statusnya
          </CardDescription>
        </CardHeader>
        <CardContent>
          {scheduledJobs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Tidak ada pengingat yang terjadwal</p>
            </div>
          ) : (
            <div className="space-y-4">
              {scheduledJobs.map((job) => (
                <div key={job.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Kegiatan ID: {job.activityId}</h4>
                      <p className="text-sm text-gray-600">{formatReminderType(job.type)}</p>
                    </div>
                    {getStatusBadge(job.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Jadwal Kirim:</span>
                      <p className="text-gray-600">
                        {job.scheduledTime.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Target Nomor:</span>
                      <p className="text-gray-600">{job.targetNumbers.join(', ')}</p>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <span className="font-medium text-sm">Preview Pesan:</span>
                    <p className="text-xs text-gray-600 mt-1 p-2 bg-gray-50 rounded">
                      {job.message.substring(0, 150)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 text-xl">ℹ️</div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Informasi Pengingat WhatsApp</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Pengingat H-2: Dikirim 2 hari sebelum kegiatan</li>
                <li>• Pengingat H-1: Dikirim 1 hari sebelum kegiatan</li>
                <li>• Pengingat Hari-H: Dikirim 2 jam sebelum kegiatan dimulai</li>
                <li>• Target nomor default: <strong>082115575219</strong></li>
                <li>• Semua pengiriman akan dicatat dalam log sistem</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReminderStatus;
