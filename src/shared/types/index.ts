// src/shared/types/index.ts

// ===== EXPORTAR TODOS LOS TIPOS =====

// Clientes
export type {
  ClientDto,
  ClientSearchParams,
  ClientSearchResponse
} from './clientTypes';

// Compañías y secciones
export type {
  CompanyDto,
  SeccionDto
} from './companyTypes';

// Datos maestros
export type {
  CategoriaDto,
  DestinoDto,
  CalidadDto,
  CombustibleDto,
  MonedaDto,
  DepartamentoDto,
  TarifaDto,
  MasterDataDto
} from './masterDataTypes';

// Azure Document Intelligence
export type {
  CuotaDetalle,
  DetalleCuotas,
  BonificacionesDto,
  CondicionesPagoDto,
  DatosBasicosDto,
  DatosCoberturaDto,
  DatosPolizaDto,
  DatosVehiculoDto,
  MetricasDto,
  ObservacionesDto,
  DatosVelneoDto,
  AzureProcessResult,
  ProcessDocumentRequest,
  ProcessDocumentResponse
} from './azureTypes';

// Formulario de póliza
export type {
  PolizaFormData,
  ValidationErrors,
  FormValidationResult,
  WizardStep,
  WizardState
} from './polizaFormTypes';

// API Velneo
export type {
  PolizaCreateRequest,
  CreatePolizaResponse,
  VelneoPolizaDto,
  PolizaHistorialDto,
  PolizaHistorialResponse,
  PolizaSearchFilters
} from './velneoApiTypes';

// ===== TIPOS COMUNES =====
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface UploadState extends LoadingState {
  progress: number;
  isUploading: boolean;
}