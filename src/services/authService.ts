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
          console.log('✅ AuthService: User loaded from storage:', user.nama);
        } else {
          console.log('❌ AuthService: Invalid user data in storage, clearing...');
          this.clearStorage();
        }
      } else if (savedUser || savedToken) {
        // If only one exists, clear both for consistency
        console.log('⚠️ AuthService: Inconsistent storage state, clearing...');
        this.clearStorage();
      }
    } catch (error) {
      console.error('❌ AuthService: Error loading user from storage:', error);
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
      console.log('🔐 AuthService: Login attempt for:', credentials.email);
      
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
          const userJson = JSON.stringify(user);
          localStorage.setItem('currentUser', userJson);
          localStorage.setItem('authToken', token);
          this.currentUser = user;
          
          console.log('✅ AuthService: User data saved to localStorage');
          console.log('✅ AuthService: User logged in successfully:', user.nama);
          
          // Immediate verification
          const verification = this.isAuthenticated();
          console.log('✅ AuthService: Authentication verification:', verification);
          
        } catch (storageError) {
          console.error('❌ AuthService: Error saving to localStorage:', storageError);
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
        console.log('❌ AuthService: Invalid credentials provided');
        return {
          success: false,
          message: 'Email atau password salah!'
        };
      }
    } catch (error) {
      console.error('❌ AuthService: Login error:', error);
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
    console.log('🚪 AuthService: Logging out user');
    this.clearStorage();
  }

  getCurrentUser(): User | null {
    // Always return the current cached user, don't reload from storage
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    // Only reload if we don't have a current user
    if (!this.currentUser) {
      this.loadUserFromStorage();
    }
    
    const user = this.currentUser;
    const token = localStorage.getItem('authToken');
    const isAuth = user !== null && token !== null;
    
    console.log('🔐 AuthService: Authentication check:', { 
      hasUser: !!user, 
      hasToken: !!token, 
      isAuth,
      userName: user?.nama || 'N/A'
    });
    
    return isAuth;
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Method to refresh user data if needed
  refreshUserData(): void {
    console.log('🔄 AuthService: Refreshing user data from storage');
    this.loadUserFromStorage();
  }
}

export const authService = new AuthService();
export type { User, LoginCredentials, AuthResponse };
