import type { LoginRequest, LoginResponse, User } from "../types/auth.types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7191/api';

export class AuthService {
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
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
    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
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