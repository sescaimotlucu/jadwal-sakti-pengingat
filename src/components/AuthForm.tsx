
import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface AuthFormProps {
  isLogin: boolean;
  onToggle: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin, onToggle }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  useEffect(() => {
    // Auto-focus email field when component mounts
    const emailInput = document.getElementById('email-input');
    if (emailInput) {
      emailInput.focus();
    }
  }, [isLogin]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email) {
      newErrors.email = 'Email tidak boleh kosong';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!password) {
      newErrors.password = 'Password tidak boleh kosong';
    } else if (password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    if (!isLogin && !name) {
      newErrors.name = 'Nama lengkap tidak boleh kosong';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Simulate API call
    setTimeout(() => {
      if (isLogin) {
        toast({
          title: "Berhasil masuk!",
          description: "Selamat datang kembali",
        });
      } else {
        toast({
          title: "Pendaftaran berhasil!",
          description: "Akun Anda telah dibuat",
        });
        onToggle(); // Switch to login form after successful registration
      }
    }, 1000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-yellow-300 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl text-white">
            {isLogin ? '🔐' : '👤'}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 font-poppins">
          {isLogin ? 'Masuk' : 'Daftar'}
        </h1>
      </div>

      {!isLogin && (
        <div className="space-y-2">
          <Label htmlFor="name-input" className="text-sm font-medium text-gray-700">
            Nama Lengkap
          </Label>
          <div className="relative">
            <Input
              id="name-input"
              type="text"
              placeholder="Masukkan nama lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`pl-10 ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
              aria-label="Nama lengkap"
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <span className="text-sm">👤</span>
            </div>
          </div>
          {errors.name && (
            <p id="name-error" className="text-sm text-red-500" role="alert">
              {errors.name}
            </p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email-input" className="text-sm font-medium text-gray-700">
          Email
        </Label>
        <div className="relative">
          <Input
            id="email-input"
            type="email"
            placeholder="Masukkan email Anda"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`pl-10 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
            aria-label="Alamat email"
            aria-describedby={errors.email ? "email-error" : undefined}
            autoComplete="email"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <span className="text-sm">📧</span>
          </div>
        </div>
        {errors.email && (
          <p id="email-error" className="text-sm text-red-500" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password-input" className="text-sm font-medium text-gray-700">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password-input"
            type={showPassword ? 'text' : 'password'}
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`pl-10 pr-10 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
            aria-label="Password"
            aria-describedby={errors.password ? "password-error" : undefined}
            autoComplete={isLogin ? "current-password" : "new-password"}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <span className="text-sm">🔒</span>
          </div>
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            <Eye size={16} className={showPassword ? 'text-green-500' : ''} />
          </button>
        </div>
        {errors.password && (
          <p id="password-error" className="text-sm text-red-500" role="alert">
            {errors.password}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-green-400 to-yellow-300 hover:from-green-500 hover:to-yellow-400 text-white font-semibold py-3 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
      >
        {isLogin ? 'MASUK' : 'DAFTAR'}
      </Button>

      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600">
          {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
        </p>
        <button
          type="button"
          onClick={onToggle}
          className="text-green-500 hover:text-green-600 font-medium text-sm transition-colors hover:underline"
        >
          {isLogin ? 'Daftar sekarang' : 'Masuk di sini'}
        </button>
      </div>
    </form>
  );
};

export default AuthForm;
