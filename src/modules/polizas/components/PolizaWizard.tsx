import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { Progress } from "../../../shared/components/ui/progress";
import { Alert, AlertDescription } from "../../../shared/components/ui/alert";
import { 
  Users, 
  Building2, 
  FileText, 
  FormInput,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { usePoliza } from "../../../shared/hooks/usePoliza";
import { ClientSearch } from "./ClientSearch";
import { CompanySelector } from "./CompanySelector";
import { DocumentUpload } from "./DocumentUpload";

const FormStep: React.FC = () => {
  const { 
    scannedData, 
    submitPoliza, 
    isSubmitting, 
    setCurrentStep,
    selectedClient,
    selectedCompany,
    selectedSection
  } = usePoliza();

  // Debug: mostrar datos en consola
  React.useEffect(() => {
    console.log('🔍 FormStep - Datos disponibles:', {
      scannedData: scannedData,
      selectedClient: selectedClient,
      selectedCompany: selectedCompany,
      selectedSection: selectedSection
    });
  }, [scannedData, selectedClient, selectedCompany, selectedSection]);
  
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <FormInput className="h-12 w-12 mx-auto text-primary" />
        <h3 className="text-xl font-semibold">Revisar y Completar</h3>
        <p className="text-muted-foreground">
          Revisa los datos extraídos y completa la información faltante
        </p>
      </div>
      
      {/* Información del procesamiento */}
      {scannedData && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Documento procesado exitosamente: {scannedData.porcentajeCompletitud}% completitud - {scannedData.datosVelneo?.metricas?.camposExtraidos} campos extraídos
          </AlertDescription>
        </Alert>
      )}

      {/* Resumen de selecciones */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm">Resumen de Selecciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Cliente:</span>
            <span>{selectedClient?.clinom || 'No seleccionado'}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Compañía:</span>
            <span>{selectedCompany?.comalias || 'No seleccionado'}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Ramo:</span>
            <span>{selectedSection?.seccion || 'No seleccionado'}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Archivo:</span>
            <span>{scannedData?.archivo || 'N/A'}</span>
          </div>
        </CardContent>
      </Card>

      {/* DATOS BÁSICOS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-600">📋 Datos Básicos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Asegurado</label>
              <div className="p-3 border rounded-lg bg-background">
                {scannedData?.datosVelneo?.datosBasicos?.asegurado || selectedClient?.clinom || 'No extraído'}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Documento</label>
              <div className="p-3 border rounded-lg bg-background">
                {scannedData?.datosVelneo?.datosBasicos?.documento || selectedClient?.cliruc || 'No extraído'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo</label>
              <div className="p-3 border rounded-lg bg-background">
                {scannedData?.datosVelneo?.datosBasicos?.tipo || 'No extraído'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Domicilio</label>
              <div className="p-3 border rounded-lg bg-background">
                {scannedData?.datosVelneo?.datosBasicos?.domicilio || selectedClient?.clidir || 'No extraído'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Departamento</label>
              <div className="p-3 border rounded-lg bg-background">
                {scannedData?.datosVelneo?.datosBasicos?.departamento || 'No extraído'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Corredor</label>
              <div className="p-3 border rounded-lg bg-background">
                {scannedData?.datosVelneo?.datosBasicos?.corredor || 'No extraído'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="p-3 border rounded-lg bg-background">
                {scannedData?.datosVelneo?.datosBasicos?.email || selectedClient?.cliemail || 'No extraído'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Teléfono</label>
              <div className="p-3 border rounded-lg bg-background">
                {scannedData?.datosVelneo?.datosBasicos?.telefono || selectedClient?.clitel || 'No extraído'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Trámite</label>
              <div className="p-3 border rounded-lg bg-background">
                {scannedData?.datosVelneo?.datosBasicos?.tramite || 'No extraído'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DATOS DE LA PÓLIZA */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-green-600">📄 Datos de la Póliza</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Número de Póliza</label>
              <div className="p-3 border rounded-lg bg-background font-mono">
                {scannedData?.datosVelneo?.datosPoliza?.numeroPoliza || 'No extraído'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Endoso</label>
              <div className="p-3 border rounded-lg bg-background">
                {scannedData?.datosVelneo?.datosPoliza?.endoso || 'No extraído'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Certificado</label>
              <div className="p-3 border rounded-lg bg-background">
                {scannedData?.datosVelneo?.datosPoliza?.certificado || 'No extraído'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Vigencia Desde</label>
              <div className="p-3 border rounded-lg bg-background">
                {scannedData?.datosVelneo?.datosPoliza?.desde || 'No extraído'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Vigencia Hasta</label>
              <div className="p-3 border rounded-lg bg-background">
                {scannedData?.datosVelneo?.datosPoliza?.hasta || 'No extraído'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ramo</label>
              <div className="p-3 border rounded-lg bg-background">
                {scannedData?.datosVelneo?.datosPoliza?.ramo || 'No extraído'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo Movimiento</label>
              <div className="p-3 border rounded-lg bg-background">
                {scannedData?.datosVelneo?.datosPoliza?.tipoMovimiento || 'No extraído'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DATOS DEL VEHÍCULO */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-purple-600">🚗 Datos del Vehículo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Marca y Modelo</label>
              <div className="p-3 border rounded-lg bg-background">
                {scannedData?.datosVelneo?.datosVehiculo?.marcaModelo || 'No extraído'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Año</label>
              <div className="p-3 border rounded-lg bg-background">
                {scannedData?.datosVelneo?.datosVehiculo?.anio || 'No extraído'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Marca</label>
              <div className="p-3 border rounded-lg bg-background">
                {scannedData?.datosVelneo?.datosVehiculo?.marca || 'No extraído'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Modelo</label>
              <div className="p-3 border rounded-lg bg-background">
                {scannedData?.datosVelneo?.datosVehiculo?.modelo || 'No extraído'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Categoría</label>
              <div className="p-3 border rounded-lg bg-background">
                {scannedData?.datosVelneo?.datosVehiculo?.categoria || 'No extraído'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Matrícula</label>
              <div className="p-3 border rounded-lg bg-background">
                {scannedData?.datosVelneo?.datosVehiculo?.matricula || 'No extraído'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Chasis</label>
              <div className="p-3 border rounded-lg bg-background font-mono text-xs">
                {scannedData?.datosVelneo?.datosVehiculo?.chasis || 'No extraído'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Motor</label>
              <div className="p-3 border rounded-lg bg-background">
                {scannedData?.datosVelneo?.datosVehiculo?.motor || 'No extraído'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Combustible</label>
              <div className="p-3 border rounded-lg bg-background">
                {scannedData?.datosVelneo?.datosVehiculo?.combustible || 'No extraído'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Destino</label>
              <div className="p-3 border rounded-lg bg-background">
                {scannedData?.datosVelneo?.datosVehiculo?.destino || 'No extraído'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Uso</label>
              <div className="p-3 border rounded-lg bg-background">
                {scannedData?.datosVelneo?.datosVehiculo?.uso || 'No extraído'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Calidad</label>
              <div className="p-3 border rounded-lg bg-background">
                {scannedData?.datosVelneo?.datosVehiculo?.calidad || 'No extraído'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CONDICIONES DE PAGO */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-orange-600">💰 Condiciones de Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Premio</label>
              <div className="p-3 border rounded-lg bg-background font-mono">
                ${scannedData?.datosVelneo?.condicionesPago?.premio?.toLocaleString() || 'No extraído'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Total</label>
              <div className="p-3 border rounded-lg bg-background font-mono">
                ${scannedData?.datosVelneo?.condicionesPago?.total?.toLocaleString() || 'No extraído'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Cuotas</label>
              <div className="p-3 border rounded-lg bg-background">
                {scannedData?.datosVelneo?.condicionesPago?.cuotas || 'No extraído'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Valor Cuota</label>
              <div className="p-3 border rounded-lg bg-background font-mono">
                ${scannedData?.datosVelneo?.condicionesPago?.valorCuota?.toLocaleString() || 'No extraído'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Forma de Pago</label>
              <div className="p-3 border rounded-lg bg-background">
                {scannedData?.datosVelneo?.condicionesPago?.formaPago || 'No extraído'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Moneda</label>
              <div className="p-3 border rounded-lg bg-background">
                {scannedData?.datosVelneo?.condicionesPago?.moneda || 'No extraído'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* COBERTURA */}
      {scannedData?.datosVelneo?.datosCobertura && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-cyan-600">🛡️ Datos de Cobertura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Cobertura</label>
                <div className="p-3 border rounded-lg bg-background">
                  {scannedData.datosVelneo.datosCobertura.cobertura || 'No extraído'}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Zona Circulación</label>
                <div className="p-3 border rounded-lg bg-background">
                  {scannedData.datosVelneo.datosCobertura.zonaCirculacion || 'No extraído'}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Moneda Cobertura</label>
                <div className="p-3 border rounded-lg bg-background">
                  {scannedData.datosVelneo.datosCobertura.moneda || 'No extraído'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CRONOGRAMA DE CUOTAS */}
      {scannedData?.datosVelneo?.condicionesPago?.detalleCuotas?.tieneCuotasDetalladas && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-indigo-600">📅 Cronograma de Cuotas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {scannedData.datosVelneo.condicionesPago.detalleCuotas.cuotas?.slice(0, 6).map((cuota: any, index: number) => (
                <div key={index} className="p-2 border rounded text-sm">
                  <div className="font-medium">Cuota {cuota.numero}</div>
                  <div className="text-muted-foreground">
                    {new Date(cuota.fechaVencimiento).toLocaleDateString()} - ${cuota.monto?.toLocaleString()}
                  </div>
                </div>
              ))}
              {(scannedData.datosVelneo.condicionesPago.detalleCuotas.cuotas?.length || 0) > 6 && (
                <div className="p-2 border rounded text-sm text-center text-muted-foreground">
                  +{(scannedData.datosVelneo.condicionesPago.detalleCuotas.cuotas?.length || 0) - 6} cuotas más...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Observaciones */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Observaciones</label>
        <div className="p-3 border rounded-lg bg-muted text-sm">
          Procesado con Azure Document Intelligence - {scannedData?.porcentajeCompletitud || 0}% completitud
          <br/>
          {scannedData?.datosVelneo?.observaciones?.notasEscaneado?.join('. ') || ''}
          {scannedData?.datosVelneo?.metricas?.camposFaltantes && scannedData.datosVelneo.metricas.camposFaltantes.length > 0 && (
            <><br/>Campos pendientes: {scannedData.datosVelneo.metricas.camposFaltantes.join(', ')}</>
          )}
        </div>
      </div>
      
      {/* Navegación */}
      <div className="flex space-x-4">
        <Button 
          variant="outline"
          onClick={() => setCurrentStep('document')}
          disabled={isSubmitting}
        >
          Volver al Documento
        </Button>
        
        <Button 
          onClick={submitPoliza} 
          className="flex-1" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Enviando a Velneo...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Enviar Póliza a Velneo
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

// Componente de éxito - SOLO VARIABLES USADAS
const SuccessStep: React.FC = () => {
  const { resetWizard, selectedClient } = usePoliza();
  
  const handleNewPoliza = () => {
    resetWizard();
  };

  const handleGoToDashboard = () => {
    window.location.reload();
  };
  
  return (
    <div className="text-center space-y-6">
      <CheckCircle2 className="h-16 w-16 mx-auto text-green-500" />
      
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-green-700">¡Póliza Creada Exitosamente!</h3>
        <p className="text-muted-foreground">
          La póliza para <strong>{selectedClient?.clinom}</strong> ha sido enviada correctamente a Velneo
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="text-sm space-y-1">
          <p><strong>Cliente:</strong> {selectedClient?.clinom}</p>
          <p><strong>Documento:</strong> {selectedClient?.cliruc}</p>
          <p><strong>Fecha:</strong> {new Date().toLocaleDateString()}</p>
          <p><strong>Estado:</strong> <span className="text-green-600 font-medium">Enviado a Velneo</span></p>
        </div>
      </div>
      
      <div className="flex space-x-4 justify-center">
        <Button variant="outline" onClick={handleNewPoliza}>
          Nueva Póliza
        </Button>
        <Button onClick={handleGoToDashboard}>
          Ir al Dashboard
        </Button>
      </div>
    </div>
  );
};

// Componente principal del wizard - SOLO VARIABLES USADAS
export const PolizaWizard: React.FC = () => {
  const { 
    currentStep, 
    error,
    clearError
  } = usePoliza();

  const steps = [
    { id: 'client', title: 'Cliente', icon: Users },
    { id: 'company', title: 'Compañía', icon: Building2 },
    { id: 'document', title: 'Documento', icon: FileText },
    { id: 'form', title: 'Formulario', icon: FormInput },
    { id: 'success', title: 'Finalizado', icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 'client':
        return <ClientSearch />;
      case 'company':
        return <CompanySelector />;
      case 'document':
        return <DocumentUpload />;
      case 'form':
        return <FormStep />;
      case 'success':
        return <SuccessStep />;
      default:
        return <ClientSearch />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Nueva Póliza</h1>
        <p className="text-muted-foreground">
          Procesamiento inteligente con Azure Document Intelligence
        </p>
      </div>

      {/* Progress Steps */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isCompleted 
                    ? 'bg-primary border-primary text-primary-foreground'
                    : isActive 
                    ? 'border-primary text-primary'
                    : 'border-muted-foreground text-muted-foreground'
                }`}>
                  <StepIcon className="h-5 w-5" />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-px mx-4 ${
                    isCompleted ? 'bg-primary' : 'bg-muted-foreground/25'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      {/* Error Global */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearError}
              className="ml-2"
            >
              Cerrar
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            Paso {currentStepIndex + 1} de {steps.length}: {steps[currentStepIndex]?.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>
    </div>
  );
};