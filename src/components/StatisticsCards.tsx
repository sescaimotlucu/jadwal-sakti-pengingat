
import React from 'react';
import { Activity } from '../services/databaseService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Calendar, CheckCircle, Bell, TrendingUp, Users, Clock } from 'lucide-react';

interface StatisticsCardsProps {
  activities: Activity[];
}

const StatisticsCards = ({ activities }: StatisticsCardsProps) => {
  const totalActivities = activities.length;
  const activeActivities = activities.filter(a => a.status === 'aktif').length;
  const completedActivities = activities.filter(a => a.status === 'selesai').length;
  const cancelledActivities = activities.filter(a => a.status === 'dibatalkan').length;
  const activeReminders = activeActivities * 3; // H-2, H-1, Hari-H
  
  // Hitung kegiatan hari ini
  const today = new Date().toISOString().split('T')[0];
  const todayActivities = activities.filter(a => a.tanggal === today && a.status === 'aktif').length;

  const stats = [
    {
      title: 'Total Kegiatan',
      value: totalActivities,
      description: 'Kegiatan terdaftar',
      icon: Calendar,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Kegiatan Aktif',
      value: activeActivities,
      description: 'Sedang berjalan',
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-100',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Kegiatan Hari Ini',
      value: todayActivities,
      description: 'Agenda hari ini',
      icon: Clock,
      gradient: 'from-orange-500 to-amber-600',
      bgGradient: 'from-orange-50 to-amber-100',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Kegiatan Selesai',
      value: completedActivities,
      description: 'Telah diselesaikan',
      icon: CheckCircle,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Pengingat Aktif',
      value: activeReminders,
      description: 'H-2, H-1, Hari-H',
      icon: Bell,
      gradient: 'from-yellow-500 to-yellow-600',
      bgGradient: 'from-yellow-50 to-yellow-100',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    {
      title: 'Tingkat Penyelesaian',
      value: totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0,
      description: 'Persentase selesai',
      icon: Users,
      gradient: 'from-indigo-500 to-indigo-600',
      bgGradient: 'from-indigo-50 to-indigo-100',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      suffix: '%'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Statistik Kegiatan</h2>
        <p className="text-gray-600 text-lg">Ringkasan data kegiatan dan pengingat</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card 
            key={stat.title} 
            className={`relative overflow-hidden border-0 bg-gradient-to-br ${stat.bgGradient} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in card-hover`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  {stat.title}
                </CardTitle>
                <div className={`p-3 rounded-xl ${stat.iconBg} shadow-sm`}>
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-baseline space-x-2">
                  <div className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.value}{stat.suffix || ''}
                  </div>
                </div>
                <p className="text-sm text-gray-600 font-medium">{stat.description}</p>
                
                {/* Progress bar untuk beberapa statistik */}
                {stat.title === 'Tingkat Penyelesaian' && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r ${stat.gradient} h-2 rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${stat.value}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {stat.title === 'Kegiatan Aktif' && activeActivities > 0 && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r ${stat.gradient} h-2 rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${Math.min((activeActivities / totalActivities) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 transform translate-x-8 -translate-y-8">
              <div className={`w-full h-full bg-gradient-to-br ${stat.gradient} rounded-full opacity-10`}></div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="border-0 bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gray-800">
              <div className="p-2 bg-gray-200 rounded-lg">
                <TrendingUp className="w-5 h-5 text-gray-600" />
              </div>
              Ringkasan Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Aktif</span>
                <span className="font-bold text-green-600">{activeActivities}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Selesai</span>
                <span className="font-bold text-purple-600">{completedActivities}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Dibatalkan</span>
                <span className="font-bold text-red-600">{cancelledActivities}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gray-800">
              <div className="p-2 bg-green-200 rounded-lg">
                <Bell className="w-5 h-5 text-green-600" />
              </div>
              Status Pengingat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Pengingat</span>
                <span className="font-bold text-green-600">{activeReminders}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Per Kegiatan</span>
                <span className="font-bold text-emerald-600">3 pengingat</span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Setiap kegiatan aktif mendapat 3 pengingat: H-2, H-1, dan Hari-H
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatisticsCards;
