
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const SettingsPanel = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengaturan Sistem</CardTitle>
        <CardDescription>
          Konfigurasi pengingat WhatsApp dan nomor target
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">✅ Nomor Target Aktif</h4>
          <p className="text-green-700 text-sm">
            Semua pengingat akan dikirim ke nomor: <strong>082115575219</strong>
          </p>
        </div>
        
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">🔧 Jadwal Pengingat</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• H-2: 2 hari sebelum kegiatan (jam 09:00)</li>
            <li>• H-1: 1 hari sebelum kegiatan (jam 09:00)</li>
            <li>• Hari-H: 2 jam sebelum kegiatan dimulai</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsPanel;
