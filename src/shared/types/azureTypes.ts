// src/shared/types/azureTypes.ts

// ===== ESTRUCTURA REAL DE AZURE DOCUMENT INTELLIGENCE =====
export interface CuotaDetalle {
  estado: string;
  fechaVencimiento: string;
  monto: number;
  numero: number;
}

export interface DetalleCuotas {
  cantidadTotal: number;
  cuotas: CuotaDetalle[];
  montoPromedio: number;
  primaCuota: number;
  primerVencimiento: string;
  primeraCuota: CuotaDetalle;
  tieneCuotasDetalladas: boolean;
}

export interface BonificacionesDto {
  bonificaciones: any[];
  descuentos: number;
  impuestoMSP: number;
  recargos: number;
  totalBonificaciones: number;
}

export interface CondicionesPagoDto {
  cuotas: number;
  detalleCuotas: DetalleCuotas;
  formaPago: string;
  moneda: string;
  premio: number;
  total: number;
  valorCuota: number;
}

export interface DatosBasicosDto {
  asegurado: string;
  asignado: string;
  codigoPostal: string;
  corredor: string;
  departamento: string;
  documento: string;
  domicilio: string;
  email: string;
  estado: string;
  fecha: string;
  localidad: string;
  telefono: string;
  tipo: string;
  tramite: string;
}

export interface DatosCoberturaDto {
  cobertura: string;
  codigoMoneda: number;
  moneda: string;
  zonaCirculacion: string;
}

export interface DatosPolizaDto {
  certificado: string;
  compania: string;
  desde: string;
  endoso: string;
  hasta: string;
  numeroPoliza: string;
  ramo: string;
  tipoMovimiento: string;
}

export interface DatosVehiculoDto {
  anio: string;
  calidad: string;
  categoria: string;
  chasis: string;
  color: string;
  combustible: string;
  destino: string;
  marca: string;
  marcaModelo: string;
  matricula: string;
  modelo: string;
  motor: string;
  tipoVehiculo: string;
  uso: string;
}

export interface MetricasDto {
  camposCompletos: number;
  camposConfianzaBaja: any[];
  camposExtraidos: number;
  camposFaltantes: any[];
  porcentajeCompletitud: number;
  tieneDatosMinimos: boolean;
}

export interface ObservacionesDto {
  informacionAdicional: string;
  notasEscaneado: string[];
  observacionesGenerales: string;
  observacionesGestion: string;
}

export interface DatosVelneoDto {
  bonificaciones: BonificacionesDto;
  camposCompletos: number;
  condicionesPago: CondicionesPagoDto;
  datosBasicos: DatosBasicosDto;
  datosCobertura: DatosCoberturaDto;
  datosPoliza: DatosPolizaDto;
  datosVehiculo: DatosVehiculoDto;
  metricas: MetricasDto;
  observaciones: ObservacionesDto;
}

// ===== RESPUESTA COMPLETA DEL PROCESAMIENTO =====
export interface AzureProcessResult {
  archivo: string;
  datosVelneo: DatosVelneoDto;
  estado: string;
  listoParaVelneo: boolean;
  porcentajeCompletitud: number;
  procesamientoExitoso: boolean;
  tiempoProcesamiento: number;
  timestamp: string;
  tieneDatosMinimos: boolean;
  
  // Propiedades adicionales del backend (compatibilidad)
  camposExtraidos: number;
  camposFaltantes: string[];
}

// ===== REQUEST PARA PROCESAR DOCUMENTO =====
export interface ProcessDocumentRequest {
  file: File;
  clienteId?: number;
  compañiaId?: number;
}

export interface ProcessDocumentResponse {
  success: boolean;
  message?: string;
  data?: AzureProcessResult;
  error?: string;
}