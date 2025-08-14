// src/shared/types/polizaFormTypes.ts

// ===== FORMULARIO DE PÓLIZA =====
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
  monedaId: number; // Moneda de pago (moncod)
  
  // Cobertura (nuevos campos)
  coberturaId: number;
  zonaCirculacionId: number;
  monedaCoberturaId: number; // Moneda de cobertura (conviamon)
  
  // Datos adicionales
  direccionCobro: string; // Cambio de nombre: era domicilio
  observaciones: string;
  
  // Control
  procesadoConIA: boolean;
}

// ===== VALIDACIONES =====
export interface ValidationErrors {
  [key: string]: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: ValidationErrors;
}

// ===== ESTADOS DEL WIZARD =====
export type WizardStep = 'client' | 'company' | 'document' | 'form' | 'success';

export interface WizardState {
  currentStep: WizardStep;
  completedSteps: WizardStep[];
  canProceed: boolean;
}