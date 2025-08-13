// ===== TIPOS BASE =====
export interface ClientDto {
  id: number;
  clinom: string;
  cliruc: string;
  clidir: string;
  clitel?: string;
  cliemail?: string;
}

export interface CompanyDto {
  id: number;
  comnom: string;
  comalias: string;
  activo: boolean;
}

export interface SeccionDto {
  id: number;
  seccion: string;
  activo: boolean;
}

export interface MasterDataDto {
  categorias: Array<{id: number, catdsc: string}>;
  destinos: Array<{id: number, desnom: string}>;
  calidades: Array<{id: number, caldsc: string}>;
  combustibles: Array<{id: string, name: string}>;
  monedas: Array<{id: number, nombre: string, simbolo?: string}>;
  departamentos: Array<{id: number, nombre: string}>;
}

// ===== ESCANEO AZURE =====
export interface AzureProcessResult {
  success: boolean;
  archivo: string;
  datosVelneo: {
    datosBasicos: {
      asegurado: string;
      documento: string;
      domicilio?: string;
      email?: string;
      telefono?: string;
      departamento?: string;
      localidad?: string;
    };
    datosPoliza: {
      numeroPoliza: string;
      endoso?: string;
      desde?: string;
      hasta?: string;
      certificado?: string;
      tipoMovimiento?: string;
    };
    datosVehiculo: {
      marcaModelo?: string;
      marca?: string;
      modelo?: string;
      anio?: string;
      matricula?: string;
      motor?: string;
      chasis?: string;
      categoria?: string;
      destino?: string;
      calidad?: string;
      combustible?: string;
    };
    condicionesPago: {
      premio?: number;
      total?: number;
      formaPago?: string;
      cuotas?: number;
      valorCuota?: number;
    };
  };
  porcentajeCompletitud: number;
  camposExtraidos: number;
  camposFaltantes: string[];
}

// ===== FORMULARIO PÓLIZA =====
export interface PolizaFormData {
  // Datos básicos
  clienteId: number;
  compañiaId: number;
  seccionId: number;
  
  // Datos póliza
  numeroPoliza: string;
  endoso: string;
  fechaDesde: string;
  fechaHasta: string;
  certificado: string;
  
  // Datos vehículo
  marcaModelo: string;
  anio: string;
  matricula: string;
  motor: string;
  chasis: string;
  categoriaId: number;
  destinoId: number;
  calidadId: number;
  combustibleId: string;
  
  // Condiciones pago
  premio: number;
  total: number;
  formaPago: string;
  cuotas: number;
  valorCuota: number;
  monedaId: number;
  
  // Datos adicionales
  domicilio: string;
  departamentoId: number;
  observaciones: string;
  
  // Control
  procesadoConIA: boolean;
}

// ===== REQUEST A VELNEO =====
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

export interface CreatePolizaResponse {
  success: boolean;
  message: string;
  numeroPoliza: string;
  polizaCreada?: any;
}