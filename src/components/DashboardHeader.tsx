import React from 'react';
import { User } from '../services/authService';
import { Button } from './ui/button';
import { LogOut, Calendar, User as UserIcon, Bell, Settings } from 'lucide-react';

interface DashboardHeaderProps {
  user: User | null;
  onLogout: () => void;
}

const DashboardHeader = ({ user, onLogout }: DashboardHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-emerald-600 via-gray-800 to-emerald-600 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30 shadow-lg">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full flex items-center justify-center">
                <Bell className="w-2 h-2 text-emerald-800" />
              </div>
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
                Sistem Pengingat Jadwal
              </h1>
              <p className="text-emerald-100 font-medium">Dashboard Manajemen Kegiatan Warga</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                <div className="flex items-center space-x-3 text-white">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{user?.nama}</p>
                    <p className="text-xs text-emerald-100 bg-yellow-500/30 px-2 py-0.5 rounded-full inline-block">
                      {user?.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex items-center space-x-2 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
              >
                <Settings className="w-4 h-4" />
                <span>Pengaturan</span>
              </Button>
              
              <Button
                onClick={onLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 bg-red-500/20 border-red-300/50 text-white hover:bg-red-500/30 hover:border-red-300/70 transition-all duration-300 backdrop-blur-sm font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile user info */}
        <div className="md:hidden pb-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
            <div className="flex items-center space-x-3 text-white">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">{user?.nama}</p>
                <p className="text-xs text-emerald-100">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;