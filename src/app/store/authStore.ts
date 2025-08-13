import { create } from 'zustand';

// ✅ IMPORTACIONES CORRECTAS
interface LoginRequest {
  nombre: string;
  password: string;
}

interface LoginResponse {
  token: string;
  usuario: {
    id: number;
    nombre: string;
    email?: string;
  };
  tenantId: string;
  expiresAt: string;
}

interface User {
  id: number;
  nombre: string;
  email?: string;
  tenantId?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ✅ SERVICIO DE AUTH EMBEBIDO
class AuthService {
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7191/api';
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Credenciales inválidas');
        }
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de conexión con el servidor');
    }
  }

  static async validateToken(token: string): Promise<boolean> {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7191/api';
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate-token`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  static logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('tenantId');
  }

  static getStoredToken(): string | null {
    return localStorage.getItem('authToken');
  }

  static getStoredUser(): User | null {
    const userJson = localStorage.getItem('authUser');
    if (!userJson) return null;
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }

  static storeAuthData(response: LoginResponse): void {
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('authUser', JSON.stringify(response.usuario));
    localStorage.setItem('tenantId', response.tenantId);
  }
}

// ✅ STORE CORREGIDO
interface AuthStore extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  initialize: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Estado inicial
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Acción de login
  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await AuthService.login(credentials);
      
      // Guardar en localStorage
      AuthService.storeAuthData(response);
      
      // ✅ CREAR USER CON TENANTID
      const userWithTenant: User = {
        ...response.usuario,
        tenantId: response.tenantId
      };
      
      // Actualizar estado
      set({
        user: userWithTenant,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
      throw error;
    }
  },

  // Acción de logout
  logout: () => {
    AuthService.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  // Inicializar desde localStorage
  initialize: async () => {
    set({ isLoading: true });
    
    const token = AuthService.getStoredToken();
    const user = AuthService.getStoredUser();
    
    if (token && user) {
      // Validar token
      const isValid = await AuthService.validateToken(token);
      
      if (isValid) {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        // Token inválido, limpiar
        AuthService.logout();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
