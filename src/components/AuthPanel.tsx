
import React from 'react';
import { Button } from '@/components/ui/button';

interface AuthPanelProps {
  isLogin: boolean;
  onToggle: () => void;
}

const AuthPanel: React.FC<AuthPanelProps> = ({ isLogin, onToggle }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center text-white p-8 space-y-6">
      <h1 className="text-3xl font-bold font-poppins">
        {isLogin ? 'Halo, Sahabat!' : 'Selamat Datang Kembali!'}
      </h1>
      <p className="text-lg font-normal leading-relaxed max-w-md">
        {isLogin 
          ? 'Mulai perjalanan Anda dengan mendaftar dan bergabung dengan komunitas kami'
          : 'Untuk tetap terhubung dengan komunitas, silakan masuk dengan informasi pribadi Anda'
        }
      </p>
      <Button
        onClick={onToggle}
        variant="outline"
        className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-500 font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:-translate-y-1"
      >
        {isLogin ? 'DAFTAR' : 'MASUK'}
      </Button>
    </div>
  );
};

export default AuthPanel;
