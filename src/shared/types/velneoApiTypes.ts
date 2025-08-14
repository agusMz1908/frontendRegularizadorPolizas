export interface PolizaCreateRequest {
  // IDs principales
  comcod: number;
  seccod: number;
  clinro: number;
  
  // Datos póliza
  conpol: string;
  confchdes: string;
  confchhas: string;
  conend: string;
  
  // Datos financieros
  conpremio: number;
  contot: number;
  concuo: number;
  moncod: number;
  
  // Datos cliente
  asegurado: string;
  clinom: string;
  condom: string;
  documento: string;
  email?: string;
  telefono?: string;
  departamento?: string;
  
  // Datos vehículo
  conmaraut: string;
  conanioaut: number;
  conmataut: string;
  conmotor: string;
  conchasis: string;
  marca: string;
  modelo: string;
  combustible: string;
  
  // IDs maestros
  catdsc: number;
  desdsc: number;
  caldsc: number;
  
  // Control
  observaciones: string;
  procesadoConIA: boolean;
  formaPago: string;
  cantidadCuotas: number;
  valorCuota: number;
}

// ===== RESPUESTA DE CREAR PÓLIZA =====
export interface CreatePolizaResponse {
  success: boolean;
  message: string;
  numeroPoliza: string;
  polizaCreada?: VelneoPolizaDto;
  errors?: string[];
}

// ===== PÓLIZA EN VELNEO =====
export interface VelneoPolizaDto {
  id: number;
  numeroPoliza: string;
  clienteId: number;
  compañiaId: number;
  seccionId: number;
  fechaCreacion: string;
  estado: string;
  procesadoConIA: boolean;
}

// ===== HISTORIAL DE PÓLIZAS =====
export interface PolizaHistorialDto {
  id: number;
  numeroPoliza: string;
  clienteNombre: string;
  compañiaNombre: string;
  fechaCreacion: string;
  estado: string;
  montoTotal: number;
  procesadoConIA: boolean;
  archivo?: string;
}

export interface PolizaHistorialResponse {
  polizas: PolizaHistorialDto[];
  total: number;
  page: number;
  totalPages: number;
}

// ===== FILTROS Y BÚSQUEDA =====
export interface PolizaSearchFilters {
  numeroPoliza?: string;
  clienteId?: number;
  compañiaId?: number;
  fechaDesde?: string;
  fechaHasta?: string;
  estado?: string;
  procesadoConIA?: boolean;
  page?: number;
  limit?: number;
}