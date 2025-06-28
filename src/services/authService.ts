
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
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    try {
      const savedUser = localStorage.getItem('currentUser');
      const savedToken = localStorage.getItem('authToken');
      
      if (savedUser && savedToken) {
        const user = JSON.parse(savedUser);
        // Validate user object structure
        if (user.id && user.nama && user.email) {
          this.currentUser = user;
          console.log('✅ User loaded from storage:', user.nama);
        } else {
          console.log('❌ Invalid user data in storage, clearing...');
          this.clearStorage();
        }
      }
    } catch (error) {
      console.error('❌ Error loading user from storage:', error);
      this.clearStorage();
    }
  }

  private clearStorage(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.currentUser = null;
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
        
        // Save to localStorage with error handling
        try {
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('authToken', token);
          this.currentUser = user;
          console.log('✅ User logged in successfully:', user.nama);
        } catch (storageError) {
          console.error('❌ Error saving to localStorage:', storageError);
          return {
            success: false,
            message: 'Gagal menyimpan data login'
          };
        }
        
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
      console.error('❌ Login error:', error);
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
    console.log('🚪 Logging out user');
    this.clearStorage();
  }

  getCurrentUser(): User | null {
    // Always check localStorage for the most current data
    if (!this.currentUser) {
      this.loadUserFromStorage();
    }
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    const token = localStorage.getItem('authToken');
    const isAuth = user !== null && token !== null;
    console.log('🔐 Authentication check:', { hasUser: !!user, hasToken: !!token, isAuth });
    return isAuth;
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Method to refresh user data if needed
  refreshUserData(): void {
    this.loadUserFromStorage();
  }
}

export const authService = new AuthService();
export type { User, LoginCredentials, AuthResponse };
