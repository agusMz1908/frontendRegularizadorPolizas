import type { AzureProcessResult, ClientDto, CompanyDto, MasterDataDto, PolizaFormData, SeccionDto } from '@/shared/types';
import { create } from 'zustand';

class PolizaApiService {
  private static readonly API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7191/api';
  
  private static getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  // ===== BUSCAR CLIENTES =====
  static async searchClients(filtro: string): Promise<ClientDto[]> {
    try {
      console.log(`🔍 Buscando clientes con filtro: "${filtro}"`);
      
      const response = await fetch(`${this.API_BASE_URL}/clientes/direct?filtro=${encodeURIComponent(filtro)}`, {
        headers: this.getAuthHeaders(),
      });

      console.log(`📡 Response status: ${response.status}`);

      if (!response.ok) {
        throw new Error(`Error buscando clientes: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📊 Clientes encontrados:', data);
      
      // Tu backend devuelve: { items: [...], count: X, success: true }
      const clients = data.items || data.data || data || [];
      console.log(`✅ ${clients.length} clientes encontrados`);
      
      return clients;
    } catch (error) {
      console.error('❌ Error en searchClients:', error);
      throw error;
    }
  }

  static async getTarifas(): Promise<any[]> {
    try {
      console.log('🎯 Obteniendo tarifas...');
      
      const response = await fetch(`${this.API_BASE_URL}/Tarifa`, {
        headers: this.getAuthHeaders(),
      });

      console.log(`📡 Response status: ${response.status}`);

      if (!response.ok) {
        throw new Error(`Error obteniendo tarifas: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📊 Tarifas obtenidas:', data);
      
      const tarifas = data.data || data || [];
      console.log(`✅ ${tarifas.length} tarifas obtenidas`);
      
      return tarifas;
    } catch (error) {
      console.error('❌ Error en getTarifas:', error);
      throw error;
    }
  }

  // ===== OBTENER COMPAÑÍAS =====
  static async getCompanies(): Promise<CompanyDto[]> {
    try {
      console.log('🏢 Obteniendo compañías...');
      
      const response = await fetch(`${this.API_BASE_URL}/Companies`, {
        headers: this.getAuthHeaders(),
      });

      console.log(`📡 Response status: ${response.status}`);

      if (!response.ok) {
        throw new Error(`Error obteniendo compañías: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📊 Compañías obtenidas:', data);
      
      // Tu backend devuelve: { success: true, data: [...], total: X }
      const companies = data.data || data || [];
      console.log(`✅ ${companies.length} compañías obtenidas`);
      
      return companies;
    } catch (error) {
      console.error('❌ Error en getCompanies:', error);
      throw error;
    }
  }

  // ===== OBTENER SECCIONES =====
  static async getSecciones(): Promise<SeccionDto[]> {
    try {
      console.log('📂 Obteniendo secciones...');
      
      // Buscar endpoint correcto para secciones en tu backend
      const response = await fetch(`${this.API_BASE_URL}/secciones`, {
        headers: this.getAuthHeaders(),
      });

      console.log(`📡 Response status: ${response.status}`);

      if (!response.ok) {
        throw new Error(`Error obteniendo secciones: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📊 Secciones obtenidas:', data);
      
      const sections = data.data || data || [];
      console.log(`✅ ${sections.length} secciones obtenidas`);
      
      return sections;
    } catch (error) {
      console.error('❌ Error en getSecciones:', error);
      throw error;
    }
  }

  // ===== OBTENER MAESTROS INDIVIDUALES =====
  static async getMasterData(): Promise<MasterDataDto> {
    try {
      console.log('🎯 Obteniendo datos maestros...');
      
      // Intentar endpoint unificado primero
      const response = await fetch(`${this.API_BASE_URL}/Velneo/mapping-options`, {
        headers: this.getAuthHeaders(),
      });

      console.log(`📡 Response status: ${response.status}`);

      if (!response.ok) {
        console.warn('⚠️ Endpoint unificado falló, usando maestros individuales...');
        return await this.getMasterDataIndividual();
      }

      const data = await response.json();
      console.log('📊 Maestros obtenidos (unificado):', data);
      
      // El endpoint unificado probablemente no incluye tarifas ni departamentos
      // Cargarlos por separado en paralelo
      const promesas = [];
      
      if (!data.tarifas) {
        promesas.push(this.getTarifas().then(tarifas => ({ key: 'tarifas', value: tarifas })));
      }
      
      if (!data.departamentos || data.departamentos.length === 0) {
        promesas.push(
          fetch(`${this.API_BASE_URL}/Departamento`, { headers: this.getAuthHeaders() })
            .then(res => res.json())
            .then(res => ({ key: 'departamentos', value: res.data || [] }))
        );
      }
      
      // Ejecutar promesas adicionales si hay alguna
      if (promesas.length > 0) {
        console.log(`🔄 Cargando ${promesas.length} maestros adicionales...`);
        const resultados = await Promise.all(promesas);
        
        resultados.forEach(resultado => {
          data[resultado.key] = resultado.value;
          console.log(`✅ ${resultado.key}: ${resultado.value.length} elementos cargados`);
        });
      }

      console.log('✅ Maestros procesados correctamente');
      return data;
    } catch (error) {
      console.error('❌ Error en getMasterData:', error);
      // Si falla todo, usar método individual
      return await this.getMasterDataIndividual();
    }
  }

  // ===== OBTENER MAESTROS INDIVIDUALES (ALTERNATIVA) =====
 static async getMasterDataIndividual(): Promise<MasterDataDto> {
    try {
      console.log('🎯 Obteniendo maestros individuales...');
      
      // Hacer llamadas paralelas a cada endpoint individual (incluyendo tarifas)
      const [categorias, destinos, calidades, combustibles, monedas, departamentos, tarifas] = await Promise.all([
        fetch(`${this.API_BASE_URL}/Categoria`, { headers: this.getAuthHeaders() }),
        fetch(`${this.API_BASE_URL}/Destino`, { headers: this.getAuthHeaders() }),
        fetch(`${this.API_BASE_URL}/Calidad`, { headers: this.getAuthHeaders() }),
        fetch(`${this.API_BASE_URL}/Combustible`, { headers: this.getAuthHeaders() }),
        fetch(`${this.API_BASE_URL}/Moneda`, { headers: this.getAuthHeaders() }),
        fetch(`${this.API_BASE_URL}/Departamento`, { headers: this.getAuthHeaders() }),
        fetch(`${this.API_BASE_URL}/Tarifa`, { headers: this.getAuthHeaders() })
      ]);

      console.log('📡 Responses status:', {
        categorias: categorias.status,
        destinos: destinos.status,
        calidades: calidades.status,
        combustibles: combustibles.status,
        monedas: monedas.status,
        departamentos: departamentos.status,
        tarifas: tarifas.status
      });

      // Procesar respuestas
      const [
        categoriasData,
        destinosData, 
        calidadesData,
        combustiblesData,
        monedasData,
        departamentosData,
        tarifasData
      ] = await Promise.all([
        categorias.ok ? categorias.json() : { data: [] },
        destinos.ok ? destinos.json() : { data: [] },
        calidades.ok ? calidades.json() : { data: [] },
        combustibles.ok ? combustibles.json() : { data: [] },
        monedas.ok ? monedas.json() : { data: [] },
        departamentos.ok ? departamentos.json() : { data: [] },
        tarifas.ok ? tarifas.json() : { data: [] }
      ]);

      console.log('📊 Datos procesados:', {
        categorias: categoriasData.data?.length || 0,
        destinos: destinosData.data?.length || 0,
        calidades: calidadesData.data?.length || 0,
        combustibles: combustiblesData.data?.length || 0,
        monedas: monedasData.data?.length || 0,
        departamentos: departamentosData.data?.length || 0,
        tarifas: tarifasData.data?.length || 0
      });

      const masterData: MasterDataDto = {
        categorias: categoriasData.data || [],
        destinos: destinosData.data || [],
        calidades: calidadesData.data || [],
        combustibles: combustiblesData.data || [],
        monedas: monedasData.data || [],
        departamentos: departamentosData.data || [],
        tarifas: tarifasData.data || []
      };

      console.log('✅ Maestros individuales procesados correctamente');
      return masterData;
    } catch (error) {
      console.error('❌ Error en getMasterDataIndividual:', error);
      throw error;
    }
  }

  // ===== PROCESAR DOCUMENTO CON AZURE =====
  static async processDocument(file: File): Promise<AzureProcessResult> {
    try {
      console.log(`📄 Procesando documento: ${file.name} (${file.size} bytes)`);
      
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('authToken');
      const response = await fetch(`${this.API_BASE_URL}/AzureDocument/process`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // No agregar Content-Type para FormData
        },
        body: formData,
      });

      console.log(`📡 Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error procesando documento: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('📊 Documento procesado:', data);
      console.log(`✅ Procesamiento exitoso: ${data.porcentajeCompletitud}% completitud`);
      
      return data;
    } catch (error) {
      console.error('❌ Error en processDocument:', error);
      throw error;
    }
  }

  // ===== CREAR PÓLIZA EN VELNEO =====
  static async createPoliza(request: any): Promise<any> {
    try {
      console.log('🚀 Enviando póliza a Velneo...');
      console.log('📋 Request data:', request);
      
      const response = await fetch(`${this.API_BASE_URL}/Poliza`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      console.log(`📡 Response status: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Error response:', errorData);
        throw new Error(`Error creando póliza: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      console.log('📊 Póliza creada exitosamente:', data);
      console.log(`✅ Póliza ${request.conpol} enviada a Velneo`);
      
      return data;
    } catch (error) {
      console.error('❌ Error en createPoliza:', error);
      throw error;
    }
  }
}

// ===== STORE STATE =====
interface PolizaState {
  // Datos del wizard
  selectedClient: ClientDto | null;
  selectedCompany: CompanyDto | null;
  selectedSection: SeccionDto | null;
  scannedData: AzureProcessResult | null;
  formData: PolizaFormData | null;
  
  // Maestros y datos
  masterData: MasterDataDto | null;
  companies: CompanyDto[];
  sections: SeccionDto[];
  clients: ClientDto[];
  
  // Estados de carga
  isLoading: boolean;
  isSubmitting: boolean;
  isProcessingDocument: boolean;
  error: string | null;
  
  // Progreso del wizard
  currentStep: 'client' | 'company' | 'document' | 'form' | 'success';
  
  // ===== ACCIONES =====
  setSelectedClient: (client: ClientDto) => void;
  setSelectedCompany: (company: CompanyDto) => void;
  setSelectedSection: (section: SeccionDto) => void;
  setScannedData: (data: AzureProcessResult) => void;
  setFormData: (data: PolizaFormData) => void;
  searchClients: (filtro: string) => Promise<void>;
  loadMasterData: () => Promise<void>;
  loadCompanies: () => Promise<void>;
  loadSections: () => Promise<void>;
  processDocument: (file: File) => Promise<void>;
  submitPoliza: () => Promise<void>;
  resetWizard: () => void;
  setCurrentStep: (step: 'client' | 'company' | 'document' | 'form' | 'success') => void;
  clearError: () => void;
}

// ===== STORE IMPLEMENTATION =====
export const usePolizaStore = create<PolizaState>((set, get) => ({
  // Estado inicial
  selectedClient: null,
  selectedCompany: null,
  selectedSection: null,
  scannedData: null,
  formData: null,
  masterData: null,
  companies: [],
  sections: [],
  clients: [],
  isLoading: false,
  isSubmitting: false,
  isProcessingDocument: false,
  error: null,
  currentStep: 'client',

  // ===== SETTERS BÁSICOS =====
  setSelectedClient: (client) => {
    console.log('👤 Cliente seleccionado:', client);
    set({ selectedClient: client });
  },

  setSelectedCompany: (company) => {
    console.log('🏢 Compañía seleccionada:', company);
    set({ selectedCompany: company });
  },

  setSelectedSection: (section) => {
    console.log('📂 Sección seleccionada:', section);
    set({ selectedSection: section });
  },

  setScannedData: (data) => {
    console.log('📄 Datos de escaneo establecidos:', data);
    set({ scannedData: data });
  },

  setFormData: (data) => {
    console.log('📋 Datos de formulario establecidos:', data);
    set({ formData: data });
  },

  setCurrentStep: (step) => {
    console.log(`🚶 Cambiando a paso: ${step}`);
    set({ currentStep: step });
  },

  clearError: () => set({ error: null }),

  // ===== BUSCAR CLIENTES =====
  searchClients: async (filtro: string) => {
    if (!filtro.trim()) {
      set({ clients: [] });
      return;
    }

    set({ isLoading: true, error: null });
    
    try {
      const clients = await PolizaApiService.searchClients(filtro);
      set({ clients, isLoading: false });
    } catch (error) {
      console.error('❌ Error buscando clientes:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Error buscando clientes',
        isLoading: false,
        clients: []
      });
    }
  },

  // ===== CARGAR MAESTROS =====
loadMasterData: async () => {
  set({ isLoading: true, error: null });
  
  try {
    // Intentar primero con el endpoint unificado
    let masterData;
    try {
      masterData = await PolizaApiService.getMasterData();
    } catch (error) {
      console.log('⚠️ Endpoint unificado falló, intentando maestros individuales...');
      masterData = await PolizaApiService.getMasterDataIndividual();
    }
    
    set({ masterData, isLoading: false });
  } catch (error) {
    console.error('❌ Error cargando maestros:', error);
    set({ 
      error: error instanceof Error ? error.message : 'Error cargando maestros',
      isLoading: false 
    });
  }
},

  // ===== CARGAR COMPAÑÍAS =====
  loadCompanies: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const companies = await PolizaApiService.getCompanies();
      set({ companies, isLoading: false });
    } catch (error) {
      console.error('❌ Error cargando compañías:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Error cargando compañías',
        isLoading: false 
      });
    }
  },

  // ===== CARGAR SECCIONES =====
  loadSections: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const sections = await PolizaApiService.getSecciones();
      set({ sections, isLoading: false });
    } catch (error) {
      console.error('❌ Error cargando secciones:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Error cargando secciones',
        isLoading: false 
      });
    }
  },

  // ===== PROCESAR DOCUMENTO =====
  processDocument: async (file: File) => {
    set({ isProcessingDocument: true, error: null });
    
    try {
      const result = await PolizaApiService.processDocument(file);
      set({ 
        scannedData: result,
        isProcessingDocument: false 
      });
      
      // Auto-crear form data basado en escaneo
      const { selectedClient, selectedCompany, selectedSection } = get();
      if (selectedClient && selectedCompany && selectedSection && result.datosVelneo) {
      const formData: PolizaFormData = {
        clienteId: selectedClient.id,
        compañiaId: selectedCompany.id,
        seccionId: selectedSection.id,
        numeroPoliza: result.datosVelneo.datosPoliza?.numeroPoliza || '',
        endoso: result.datosVelneo.datosPoliza?.endoso || '0',
        fechaDesde: result.datosVelneo.datosPoliza?.desde || '',
        fechaHasta: result.datosVelneo.datosPoliza?.hasta || '',
        certificado: result.datosVelneo.datosPoliza?.certificado || '',
        marcaModelo: result.datosVelneo.datosVehiculo?.marcaModelo || '',
        anio: result.datosVelneo.datosVehiculo?.anio || '',
        matricula: result.datosVelneo.datosVehiculo?.matricula || '',
        motor: result.datosVelneo.datosVehiculo?.motor || '',
        chasis: result.datosVelneo.datosVehiculo?.chasis || '',
        categoriaId: 0, // Se mapea con maestros
        destinoId: 0,   // Se mapea con maestros
        calidadId: 0,   // Se mapea con maestros
        combustibleId: '', // Se mapea con maestros
        premio: result.datosVelneo.condicionesPago?.premio || 0,
        total: result.datosVelneo.condicionesPago?.total || 0,
        formaPago: result.datosVelneo.condicionesPago?.formaPago || '',
        cuotas: result.datosVelneo.condicionesPago?.cuotas || 1,
        valorCuota: result.datosVelneo.condicionesPago?.valorCuota || 0,
        monedaId: 1, // Default peso uruguayo
        
        // ✅ AGREGAR ESTOS CAMPOS FALTANTES:
        coberturaId: 0, // Se mapea con maestros/tarifas
        zonaCirculacionId: 0, // Se mapea con maestros/departamentos
        
        direccionCobro: result.datosVelneo.datosBasicos?.domicilio || selectedClient.clidir,
        observaciones: `Procesado con IA - ${result.porcentajeCompletitud}% completitud`,
        procesadoConIA: true,
        monedaCoberturaId: 0
      }; 
        set({ formData });
      }
      
    } catch (error) {
      console.error('❌ Error procesando documento:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Error procesando documento',
        isProcessingDocument: false 
      });
    }
  },

  // ===== ENVIAR PÓLIZA A VELNEO =====
  submitPoliza: async () => {
    const { formData, selectedClient, selectedCompany, selectedSection } = get();
    
    if (!formData || !selectedClient || !selectedCompany || !selectedSection) {
      set({ error: 'Datos incompletos para enviar póliza' });
      return;
    }

    set({ isSubmitting: true, error: null });
    
    try {
      // Construir request exacto para tu backend
      const request = {
        // IDs principales
        comcod: selectedCompany.id,
        seccod: selectedSection.id,
        clinro: selectedClient.id,
        
        // Datos póliza
        conpol: formData.numeroPoliza,
        confchdes: formData.fechaDesde,
        confchhas: formData.fechaHasta,
        conend: formData.endoso,
        
        // Datos financieros
        conpremio: formData.premio,
        contot: formData.total,
        concuo: formData.cuotas,
        moncod: formData.monedaId,
        
        // Datos cliente
        asegurado: selectedClient.clinom,
        clinom: selectedClient.clinom,
        condom: formData.direccionCobro,
        documento: selectedClient.cliruc,
        email: selectedClient.cliemail || '',
        telefono: selectedClient.clitel || '',
        departamento: '', // Se mapea después
        
        // Datos vehículo
        conmaraut: formData.marcaModelo,
        conanioaut: parseInt(formData.anio) || 0,
        conmataut: formData.matricula,
        conmotor: formData.motor,
        conchasis: formData.chasis,
        marca: formData.marcaModelo.split(' ')[0] || '',
        modelo: formData.marcaModelo.split(' ').slice(1).join(' ') || '',
        combustible: formData.combustibleId,
        
        // IDs maestros
        catdsc: formData.categoriaId,
        desdsc: formData.destinoId,
        caldsc: formData.calidadId,
        
        // Control
        observaciones: formData.observaciones,
        procesadoConIA: formData.procesadoConIA,
        formaPago: formData.formaPago,
        cantidadCuotas: formData.cuotas,
        valorCuota: formData.valorCuota
      };

      const result = await PolizaApiService.createPoliza(request);
      
      set({ 
        isSubmitting: false,
        currentStep: 'success'
      });
      
    } catch (error) {
      console.error('❌ Error enviando póliza:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Error enviando póliza',
        isSubmitting: false 
      });
    }
  },

  // ===== RESET WIZARD =====
  resetWizard: () => {
    console.log('🔄 Reseteando wizard');
    set({
      selectedClient: null,
      selectedCompany: null,
      selectedSection: null,
      scannedData: null,
      formData: null,
      currentStep: 'client',
      error: null,
      clients: []
    });
  },
}));