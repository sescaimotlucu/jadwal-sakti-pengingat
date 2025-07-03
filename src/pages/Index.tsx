import WhatsAppTester from '../components/WhatsAppTester';
import ScheduleManager from '../components/ScheduleManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { Button } from '../components/ui/button';
import { LogIn, Settings, Calendar, MessageCircle, BarChart3 } from 'lucide-react';

const Index = () => {
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-gray-900 to-black flex items-center justify-center p-4 font-poppins">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full overflow-hidden border-2 border-emerald-200">
        {/* Header with Navigation */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-emerald-50 via-yellow-50 to-emerald-50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 via-yellow-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
              <MessageCircle className="text-2xl text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-gray-800 bg-clip-text text-transparent">
                Sistem Pengingat Jadwal
              </h1>
              <p className="text-sm text-gray-600">Solusi modern untuk komunitas</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600">
                  Halo, <span className="font-semibold text-emerald-700">{currentUser?.nama}</span>
                </span>
                <Link to="/dashboard">
                  <Button className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg">
                    <Settings className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/login">
                <Button className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg">
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="text-center p-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 via-gray-800 to-emerald-700 bg-clip-text text-transparent mb-4">
            Sistem Pengingat Jadwal Otomatis
          </h2>
          <p className="text-xl text-gray-600 mb-8 font-medium">
            Solusi modern untuk pengingat kegiatan komunitas via WhatsApp
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl hover:shadow-lg transition-all duration-300 border-2 border-emerald-200 card-hover">
              <div className="text-3xl mb-3">
                <Calendar className="w-8 h-8 text-emerald-600 mx-auto" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Pengingat Otomatis</h3>
              <p className="text-gray-600 text-sm">Kirim pengingat H-2, H-1, dan hari-H secara otomatis</p>
              <div className="mt-3 w-full h-1 bg-gradient-to-r from-emerald-400 to-yellow-400 rounded-full"></div>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl hover:shadow-lg transition-all duration-300 border-2 border-yellow-200 card-hover">
              <div className="text-3xl mb-3">
                <BarChart3 className="w-8 h-8 text-yellow-600 mx-auto" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Dashboard Lengkap</h3>
              <p className="text-gray-600 text-sm">Pantau semua aktivitas dan statistik pengiriman</p>
              <div className="mt-3 w-full h-1 bg-gradient-to-r from-yellow-400 to-emerald-400 rounded-full"></div>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:shadow-lg transition-all duration-300 border-2 border-gray-200 card-hover">
              <div className="text-3xl mb-3">
                <MessageCircle className="w-8 h-8 text-gray-700 mx-auto" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Integrasi WhatsApp</h3>
              <p className="text-gray-600 text-sm">Kirim pesan langsung ke nomor warga dengan Baileys API</p>
              <div className="mt-3 w-full h-1 bg-gradient-to-r from-gray-400 to-emerald-400 rounded-full"></div>
            </div>
          </div>

          {/* Main Features in Tabs */}
          <div className="mb-8">
            <Tabs defaultValue="schedule" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-emerald-100 to-yellow-100 border-2 border-emerald-200">
                <TabsTrigger 
                  value="schedule" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-700 data-[state=active]:text-white font-semibold"
                >
                  Manajemen Jadwal
                </TabsTrigger>
                <TabsTrigger 
                  value="whatsapp"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-yellow-600 data-[state=active]:text-white font-semibold"
                >
                  Test WhatsApp
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="schedule" className="mt-6">
                <ScheduleManager />
              </TabsContent>
              
              <TabsContent value="whatsapp" className="mt-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-gray-800 bg-clip-text text-transparent mb-4">
                  Test WhatsApp Integration
                </h3>
                <WhatsAppTester />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-4">
            {!isAuthenticated ? (
              <Link 
                to="/login"
                className="inline-block bg-gradient-to-r from-emerald-600 via-yellow-500 to-emerald-600 text-white font-semibold py-4 px-8 rounded-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-lg"
              >
                Mulai Menggunakan
              </Link>
            ) : (
              <Link 
                to="/dashboard"
                className="inline-block bg-gradient-to-r from-emerald-600 via-yellow-500 to-emerald-600 text-white font-semibold py-4 px-8 rounded-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-lg"
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