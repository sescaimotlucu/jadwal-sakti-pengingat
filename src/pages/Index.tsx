
import WhatsAppTester from '../components/WhatsAppTester';
import ScheduleManager from '../components/ScheduleManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { Button } from '../components/ui/button';
import { LogIn, Settings } from 'lucide-react';

const Index = () => {
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-yellow-200 flex items-center justify-center p-4 font-poppins">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full overflow-hidden">
        {/* Header with Navigation */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-green-50 to-yellow-50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-yellow-300 rounded-full flex items-center justify-center">
              <i className="text-2xl text-white">📱</i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Sistem Pengingat Jadwal</h1>
              <p className="text-sm text-gray-600">Solusi modern untuk komunitas</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600">
                  Halo, <span className="font-semibold">{currentUser?.nama}</span>
                </span>
                <Link to="/dashboard">
                  <Button className="flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/login">
                <Button className="flex items-center space-x-2">
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="text-center p-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Sistem Pengingat Jadwal Otomatis</h2>
          <p className="text-xl text-gray-600 mb-8 font-medium">Solusi modern untuk pengingat kegiatan komunitas via WhatsApp</p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-green-50 rounded-xl hover:shadow-lg transition-all duration-300">
              <div className="text-2xl mb-3">⏰</div>
              <h3 className="font-semibold text-gray-800 mb-2">Pengingat Otomatis</h3>
              <p className="text-gray-600 text-sm">Kirim pengingat H-2, H-1, dan hari-H secara otomatis</p>
            </div>
            <div className="p-6 bg-yellow-50 rounded-xl hover:shadow-lg transition-all duration-300">
              <div className="text-2xl mb-3">📊</div>
              <h3 className="font-semibold text-gray-800 mb-2">Dashboard Lengkap</h3>
              <p className="text-gray-600 text-sm">Pantau semua aktivitas dan statistik pengiriman</p>
            </div>
            <div className="p-6 bg-green-50 rounded-xl hover:shadow-lg transition-all duration-300">
              <div className="text-2xl mb-3">📱</div>
              <h3 className="font-semibold text-gray-800 mb-2">Integrasi WhatsApp</h3>
              <p className="text-gray-600 text-sm">Kirim pesan langsung ke nomor warga dengan Baileys API</p>
            </div>
          </div>

          {/* Main Features in Tabs */}
          <div className="mb-8">
            <Tabs defaultValue="schedule" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="schedule">Manajemen Jadwal</TabsTrigger>
                <TabsTrigger value="whatsapp">Test WhatsApp</TabsTrigger>
              </TabsList>
              
              <TabsContent value="schedule" className="mt-6">
                <ScheduleManager />
              </TabsContent>
              
              <TabsContent value="whatsapp" className="mt-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Test WhatsApp Integration</h3>
                <WhatsAppTester />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-4">
            {!isAuthenticated ? (
              <Link 
                to="/login"
                className="inline-block bg-gradient-to-r from-green-400 to-yellow-300 text-white font-semibold py-3 px-8 rounded-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                Mulai Menggunakan
              </Link>
            ) : (
              <Link 
                to="/dashboard"
                className="inline-block bg-gradient-to-r from-green-400 to-yellow-300 text-white font-semibold py-3 px-8 rounded-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                Buka Dashboard
              </Link>
            )}
            <div className="text-sm text-gray-500">
              Sistem siap pakai untuk komunitas warga
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
