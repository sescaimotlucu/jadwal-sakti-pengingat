
interface User {
  id: number;
  nama: string;
  nomor_hp: string;
  email: string;
  role: 'admin' | 'pengurus' | 'warga';
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

class AuthService {
  private baseURL = 'http://localhost:3001/api'; // API backend
  private currentUser: User | null = null;

  constructor() {
    // Load user from localStorage on init
    const savedUser = localStorage.getItem('currentUser');
    const savedToken = localStorage.getItem('authToken');
    
    if (savedUser && savedToken) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Simulate API call - replace with actual backend
      if (credentials.email === 'admin@desa.com' && credentials.password === 'admin123') {
        const user: User = {
          id: 1,
          nama: 'Admin Sistem',
          nomor_hp: '6281234567890',
          email: 'admin@desa.com',
          role: 'admin'
        };
        
        const token = 'mock-jwt-token-' + Date.now();
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('authToken', token);
        this.currentUser = user;
        
        return {
          success: true,
          message: 'Login berhasil!',
          user,
          token
        };
      } else {
        return {
          success: false,
          message: 'Email atau password salah!'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Terjadi kesalahan saat login'
      };
    }
  }

  async register(userData: any): Promise<AuthResponse> {
    try {
      // Simulate registration
      const user: User = {
        id: Date.now(),
        nama: userData.nama,
        nomor_hp: userData.nomor_hp,
        email: userData.email,
        role: 'warga'
      };
      
      return {
        success: true,
        message: 'Registrasi berhasil! Silakan login.',
        user
      };
    } catch (error) {
      return {
        success: false,
        message: 'Terjadi kesalahan saat registrasi'
      };
    }
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.currentUser = null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null && localStorage.getItem('authToken') !== null;
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}

export const authService = new AuthService();
export type { User, LoginCredentials, AuthResponse };
