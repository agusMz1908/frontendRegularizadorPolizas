import type { AzureProcessResult, ClientDto, CompanyDto, CreatePolizaResponse, MasterDataDto, PolizaCreateRequest, SeccionDto } from "../types/polizaTypes";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class PolizaService {
  private static getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  // ===== CLIENTES =====
  static async searchClients(filtro: string): Promise<ClientDto[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/search?filtro=${encodeURIComponent(filtro)}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error buscando clientes: ${response.status}`);
      }

      const data = await response.json();
      return data.items || data || [];
    } catch (error) {
      console.error('Error en searchClients:', error);
      throw error;
    }
  }

  // ===== COMPAÑÍAS =====
  static async getCompanies(): Promise<CompanyDto[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/companies`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error obteniendo compañías: ${response.status}`);
      }

      const data = await response.json();
      return data.data || data || [];
    } catch (error) {
      console.error('Error en getCompanies:', error);
      throw error;
    }
  }

  // ===== SECCIONES =====
  static async getSecciones(): Promise<SeccionDto[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/secciones`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error obteniendo secciones: ${response.status}`);
      }

      const data = await response.json();
      return data.data || data || [];
    } catch (error) {
      console.error('Error en getSecciones:', error);
      throw error;
    }
  }

  // ===== MAESTROS =====
  static async getMasterData(): Promise<MasterDataDto> {
    try {
      const response = await fetch(`${API_BASE_URL}/MasterData/options`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error obteniendo maestros: ${response.status}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error en getMasterData:', error);
      throw error;
    }
  }

  // ===== AZURE DOCUMENT INTELLIGENCE =====
  static async processDocument(file: File): Promise<AzureProcessResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/azuredocument/process`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // No agregar Content-Type para FormData
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error procesando documento: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en processDocument:', error);
      throw error;
    }
  }

  // ===== CREAR PÓLIZA =====
  static async createPoliza(request: PolizaCreateRequest): Promise<CreatePolizaResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/poliza`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error creando póliza: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en createPoliza:', error);
      throw error;
    }
  }
}