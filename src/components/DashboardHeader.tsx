
import React from 'react';
import { User } from '../services/authService';
import { Button } from './ui/button';
import { LogOut, Calendar, User as UserIcon } from 'lucide-react';

interface DashboardHeaderProps {
  user: User | null;
  onLogout: () => void;
}

const DashboardHeader = ({ user, onLogout }: DashboardHeaderProps) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-yellow-300 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Sistem Pengingat Jadwal</h1>
              <p className="text-sm text-gray-600">Dashboard Manajemen Kegiatan</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-700">
              <UserIcon className="w-4 h-4" />
              <span className="text-sm font-medium">{user?.nama}</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{user?.role}</span>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
