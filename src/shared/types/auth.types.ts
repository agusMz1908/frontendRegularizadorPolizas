export interface LoginRequest {
  nombre: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  usuario: {
    id: number;
    nombre: string;
    email?: string;
  };
  tenantId: string;
  expiresAt: string;
}

export interface User {
  id: number;
  nombre: string;
  email?: string;
  tenantId?: string; 
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}