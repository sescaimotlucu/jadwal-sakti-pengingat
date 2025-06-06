
import React, { useState } from 'react';
import { authService } from '../services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';

interface AuthFormProps {
  isLogin: boolean;
  onToggle: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin, onToggle }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    nomor_hp: '',
    alamat: '',
    rt_rw: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const result = await authService.login({
          email: formData.email,
          password: formData.password
        });

        if (result.success) {
          toast.success(result.message);
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1000);
        } else {
          toast.error(result.message);
        }
      } else {
        const result = await authService.register(formData);

        if (result.success) {
          toast.success(result.message);
          setTimeout(() => {
            onToggle(); // Switch to login form
          }, 1500);
        } else {
          toast.error(result.message);
        }
      }
    } catch (error) {
      toast.error('Terjadi kesalahan sistem');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-yellow-300 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="text-2xl text-white">📱</i>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {isLogin ? 'Selamat Datang' : 'Daftar Akun'}
        </h1>
        <p className="text-gray-600">
          {isLogin 
            ? 'Masuk ke sistem pengingat jadwal' 
            : 'Buat akun baru untuk menggunakan sistem'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <>
            <div className="space-y-2">
              <Label htmlFor="nama" className="text-sm font-medium text-gray-700">
                Nama Lengkap
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="nama"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={formData.nama}
                  onChange={(e) => handleInputChange('nama', e.target.value)}
                  className="pl-10 h-12 border-gray-300 focus:border-green-400 focus:ring-green-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nomor_hp" className="text-sm font-medium text-gray-700">
                Nomor WhatsApp
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="nomor_hp"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={formData.nomor_hp}
                  onChange={(e) => handleInputChange('nomor_hp', e.target.value)}
                  className="pl-10 h-12 border-gray-300 focus:border-green-400 focus:ring-green-400"
                  required
                />
              </div>
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="nama@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="pl-10 h-12 border-gray-300 focus:border-green-400 focus:ring-green-400"
              required
              autoFocus={isLogin}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Masukkan password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="pl-10 pr-10 h-12 border-gray-300 focus:border-green-400 focus:ring-green-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {!isLogin && (
          <>
            <div className="space-y-2">
              <Label htmlFor="rt_rw" className="text-sm font-medium text-gray-700">
                RT/RW
              </Label>
              <Input
                id="rt_rw"
                type="text"
                placeholder="RT01/RW01"
                value={formData.rt_rw}
                onChange={(e) => handleInputChange('rt_rw', e.target.value)}
                className="h-12 border-gray-300 focus:border-green-400 focus:ring-green-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alamat" className="text-sm font-medium text-gray-700">
                Alamat
              </Label>
              <Input
                id="alamat"
                type="text"
                placeholder="Alamat lengkap"
                value={formData.alamat}
                onChange={(e) => handleInputChange('alamat', e.target.value)}
                className="h-12 border-gray-300 focus:border-green-400 focus:ring-green-400"
              />
            </div>
          </>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-gradient-to-r from-green-400 to-yellow-300 hover:from-green-500 hover:to-yellow-400 text-white font-semibold rounded-lg transition-all duration-300 transform hover:-translate-y-0.5"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{isLogin ? 'Masuk...' : 'Mendaftar...'}</span>
            </div>
          ) : (
            isLogin ? 'Masuk' : 'Daftar'
          )}
        </Button>

        {isLogin && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Demo Login: admin@desa.com / admin123
            </p>
          </div>
        )}
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
          <button
            type="button"
            onClick={onToggle}
            className="ml-1 text-green-600 hover:text-green-700 font-medium"
          >
            {isLogin ? 'Daftar sekarang' : 'Masuk di sini'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
