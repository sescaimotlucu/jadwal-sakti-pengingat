
import React from 'react';
import { Activity } from '../services/databaseService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface StatisticsCardsProps {
  activities: Activity[];
}

const StatisticsCards = ({ activities }: StatisticsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Total Kegiatan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">{activities.length}</div>
          <p className="text-sm text-gray-600">Kegiatan terdaftar</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Kegiatan Aktif</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">
            {activities.filter(a => a.status === 'aktif').length}
          </div>
          <p className="text-sm text-gray-600">Sedang berjalan</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pengingat Aktif</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-yellow-600">
            {activities.filter(a => a.status === 'aktif').length * 3}
          </div>
          <p className="text-sm text-gray-600">H-2, H-1, Hari-H</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsCards;
