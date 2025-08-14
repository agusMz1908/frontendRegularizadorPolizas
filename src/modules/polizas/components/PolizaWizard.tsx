// src/modules/polizas/components/PolizaWizard.tsx
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { Alert, AlertDescription } from "../../../shared/components/ui/alert";
import { Progress } from "../../../shared/components/ui/progress";
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

// Importar componentes de los steps
import { ClientSearch } from "./ClientSearch";
import { CompanySelector } from "./CompanySelector"; 
import { DocumentUpload } from "./DocumentUpload";

// ===== FORM STEP COMPONENT =====
const FormStep: React.FC = () => {
  const { 
    scannedData, 
    formData,
    submitPoliza, 
    isSubmitting, 
    setCurrentStep,
    selectedClient,
    selectedCompany,
    selectedSection,
    masterData,
    setFormData,
    loadMasterData,
    isLoading,
    error
  } = usePoliza();

  // Estado local para el formulario editable
  const [localFormData, setLocalFormData] = React.useState<any>(null);

  // Cargar datos maestros al montar el componente
  React.useEffect(() => {
    if (!masterData) {
      console.log('📊 Cargando datos maestros...');
      loadMasterData();
    }
  }, [masterData, loadMasterData]);

  // Filtrar tarifas por compañía seleccionada
  const tarifasCompania = React.useMemo(() => {
    if (!masterData?.tarifas || !selectedCompany?.id) return [];
    return masterData.tarifas.filter(t => t.companiaId === selectedCompany.id && t.activa);
  }, [masterData?.tarifas, selectedCompany?.id]);

  // Inicializar formulario con datos escaneados
  React.useEffect(() => {
    if (scannedData && !localFormData && masterData) {
      console.log('🔄 Inicializando formulario con datos escaneados...');
      console.log('📊 Master data disponible:', {
        categorias: masterData.categorias?.length || 0,
        destinos: masterData.destinos?.length || 0,
        calidades: masterData.calidades?.length || 0,
        combustibles: masterData.combustibles?.length || 0,
        monedas: masterData.monedas?.length || 0,
        departamentos: masterData.departamentos?.length || 0,
        tarifas: masterData.tarifas?.length || 0
      });
      
      const initialFormData = {
        // IDs requeridos
        clienteId: selectedClient?.id || 0,
        compañiaId: selectedCompany?.id || 0,
        seccionId: selectedSection?.id || 0,
        
        // Datos básicos de la póliza
        numeroPoliza: scannedData.datosVelneo?.datosPoliza?.numeroPoliza || '',
        endoso: scannedData.datosVelneo?.datosPoliza?.endoso || '0',
        fechaDesde: scannedData.datosVelneo?.datosPoliza?.desde ? 
          new Date(scannedData.datosVelneo.datosPoliza.desde).toISOString().split('T')[0] : '',
        fechaHasta: scannedData.datosVelneo?.datosPoliza?.hasta ? 
          new Date(scannedData.datosVelneo.datosPoliza.hasta).toISOString().split('T')[0] : '',
        certificado: scannedData.datosVelneo?.datosPoliza?.certificado || '',
        
        // Datos del vehículo
        marcaModelo: scannedData.datosVelneo?.datosVehiculo?.marcaModelo || '',
        anio: scannedData.datosVelneo?.datosVehiculo?.anio || '',
        matricula: scannedData.datosVelneo?.datosVehiculo?.matricula || '',
        motor: scannedData.datosVelneo?.datosVehiculo?.motor || '',
        chasis: scannedData.datosVelneo?.datosVehiculo?.chasis || '',
        
        // Auto-mapear categorías, destinos y calidades con los datos maestros
        categoriaId: autoMapearCategoria(scannedData.datosVelneo?.datosVehiculo?.categoria),
        destinoId: autoMapearDestino(scannedData.datosVelneo?.datosVehiculo?.destino),
        calidadId: autoMapearCalidad(scannedData.datosVelneo?.datosVehiculo?.calidad),
        combustibleId: autoMapearCombustible(scannedData.datosVelneo?.datosVehiculo?.combustible),
        
        // Condiciones de pago
        premio: scannedData.datosVelneo?.condicionesPago?.premio || 0,
        total: scannedData.datosVelneo?.condicionesPago?.total || 0,
        formaPago: scannedData.datosVelneo?.condicionesPago?.formaPago || '',
        cuotas: scannedData.datosVelneo?.condicionesPago?.cuotas || 1,
        valorCuota: scannedData.datosVelneo?.condicionesPago?.valorCuota || 0,
        monedaId: autoMapearMoneda(scannedData.datosVelneo?.condicionesPago?.moneda),
        
        // Datos adicionales
        direccionCobro: scannedData.datosVelneo?.datosBasicos?.domicilio || selectedClient?.clidir || '',
        observaciones: generarObservacionesConCronograma(scannedData),
        
        // Cobertura editable (inicializada con datos extraídos)
        coberturaId: autoMapearCobertura(scannedData.datosVelneo?.datosCobertura?.cobertura),
        zonaCirculacionId: autoMapearDepartamento(
          scannedData.datosVelneo?.datosCobertura?.zonaCirculacion || 
          scannedData.datosVelneo?.datosBasicos?.departamento
        ),
        monedaCoberturaId: autoMapearMoneda(scannedData.datosVelneo?.datosCobertura?.moneda),
        
        // Control
        procesadoConIA: true
      };
      
      console.log('📋 Datos iniciales del formulario:', initialFormData);
      console.log('🔍 Debug zona circulación:', {
        textoExtraido: scannedData.datosVelneo?.datosCobertura?.zonaCirculacion || scannedData.datosVelneo?.datosBasicos?.departamento,
        zonaCirculacionId: initialFormData.zonaCirculacionId,
        departamentosDisponibles: masterData.departamentos?.map(d => ({ id: d.id, nombre: d.nombre }))
      });
      
      setLocalFormData(initialFormData);
    }
  }, [scannedData, selectedClient, selectedCompany, selectedSection, localFormData, masterData, tarifasCompania]);

  // Funciones de auto-mapeo
  const autoMapearCategoria = (categoriaTexto: string | undefined) => {
    if (!categoriaTexto || !masterData?.categorias) return 0;
    const categoria = masterData.categorias.find(c => 
      c.catdsc.toLowerCase().includes(categoriaTexto.toLowerCase()) ||
      categoriaTexto.toLowerCase().includes(c.catdsc.toLowerCase())
    );
    return categoria?.id || 0;
  };

  const autoMapearDestino = (destinoTexto: string | undefined) => {
    if (!destinoTexto || !masterData?.destinos) return 0;
    const destino = masterData.destinos.find(d => 
      d.desnom.toLowerCase().includes(destinoTexto.toLowerCase()) ||
      destinoTexto.toLowerCase().includes(d.desnom.toLowerCase())
    );
    return destino?.id || 0;
  };

  const autoMapearCalidad = (calidadTexto: string | undefined) => {
    if (!calidadTexto || !masterData?.calidades) return 0;
    const calidad = masterData.calidades.find(c => 
      c.caldsc.toLowerCase().includes(calidadTexto.toLowerCase()) ||
      calidadTexto.toLowerCase().includes(c.caldsc.toLowerCase())
    );
    return calidad?.id || 0;
  };

  const autoMapearCombustible = (combustibleTexto: string | undefined) => {
    if (!combustibleTexto || !masterData?.combustibles) return '';
    const combustible = masterData.combustibles.find(c => 
      c.name.toLowerCase().includes(combustibleTexto.toLowerCase()) ||
      combustibleTexto.toLowerCase().includes(c.name.toLowerCase())
    );
    return combustible?.id || '';
  };

  const autoMapearMoneda = (monedaTexto: string | undefined) => {
    if (!monedaTexto || !masterData?.monedas) return 1; // Default UYU
    
    // Buscar por nombre exacto o código
    const moneda = masterData.monedas.find(m => {
      const nombre = m.nombre.toLowerCase();
      const texto = monedaTexto.toLowerCase();
      return nombre.includes(texto) || 
             texto.includes(nombre) ||
             (texto === 'uyu' && nombre.includes('peso')) ||
             (texto === 'peso uruguayo' && nombre.includes('peso')) ||
             (texto.includes('uruguayo') && nombre.includes('peso'));
    });
    
    console.log(`🔍 Auto-mapeo moneda: "${monedaTexto}" → ${moneda?.nombre || 'No encontrado'} (ID: ${moneda?.id || 1})`);
    return moneda?.id || 1;
  };

  // Función para generar observaciones con cronograma incluido
  const generarObservacionesConCronograma = (scannedData: any) => {
    let observaciones = `Procesado con Azure Document Intelligence - ${scannedData.porcentajeCompletitud}% completitud\n`;
    
    // Agregar cronograma de cuotas si existe
    if (scannedData?.datosVelneo?.condicionesPago?.detalleCuotas?.tieneCuotasDetalladas) {
      const detalleCuotas = scannedData.datosVelneo.condicionesPago.detalleCuotas;
      observaciones += `\n=== CRONOGRAMA DE CUOTAS EXTRAÍDO ===\n`;
      observaciones += `Total cuotas: ${detalleCuotas.cantidadTotal}\n`;
      observaciones += `Monto promedio: ${detalleCuotas.montoPromedio?.toLocaleString()}\n`;
      observaciones += `Primera cuota: ${new Date(detalleCuotas.primerVencimiento).toLocaleDateString('es-UY')}\n\n`;
      
      // Listar todas las cuotas
      detalleCuotas.cuotas?.forEach((cuota: any, index: number) => {
        const fecha = new Date(cuota.fechaVencimiento).toLocaleDateString('es-UY');
        observaciones += `Cuota ${cuota.numero}: ${fecha} - ${cuota.monto?.toLocaleString()} (${cuota.estado})\n`;
      });
      
      observaciones += `\n=== FIN CRONOGRAMA ===`;
    }
    
    return observaciones;
  };

  const autoMapearCobertura = (coberturaTexto: string | undefined) => {
    if (!coberturaTexto || !tarifasCompania.length) return 0;
    const cobertura = tarifasCompania.find(t => 
      t.nombre.toLowerCase().includes(coberturaTexto.toLowerCase()) ||
      coberturaTexto.toLowerCase().includes(t.nombre.toLowerCase())
    );
    console.log(`🔍 Auto-mapeo cobertura: "${coberturaTexto}" → ${cobertura?.nombre || 'No encontrado'} (ID: ${cobertura?.id || 0})`);
    return cobertura?.id || 0;
  };

  const autoMapearDepartamento = (departamentoTexto: string | undefined) => {
    if (!departamentoTexto || !masterData?.departamentos) {
      console.log('🔍 Auto-mapeo departamento falló:', { 
        texto: departamentoTexto, 
        tieneDepartamentos: !!masterData?.departamentos,
        cantidadDepartamentos: masterData?.departamentos?.length || 0
      });
      return 0;
    }
    
    const departamento = masterData.departamentos.find(d => {
      const nombre = d.nombre.toLowerCase();
      const texto = departamentoTexto.toLowerCase();
      return nombre.includes(texto) || texto.includes(nombre);
    });
    
    console.log(`🔍 Auto-mapeo departamento: "${departamentoTexto}" → ${departamento?.nombre || 'No encontrado'} (ID: ${departamento?.id || 0})`);
    console.log('📊 Departamentos disponibles:', masterData.departamentos.map(d => ({ id: d.id, nombre: d.nombre })));
    
    return departamento?.id || 0;
  };

  // Función para actualizar campos del formulario
  const updateField = (field: string, value: any) => {
    setLocalFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = () => {
    if (localFormData) {
      // Actualizar el store con los datos editados
      setFormData(localFormData);
      // Enviar a Velneo
      submitPoliza();
    }
  };

  if (!localFormData || isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>{isLoading ? 'Cargando datos maestros...' : 'Cargando formulario...'}</span>
      </div>
    );
  }

  // Mostrar error si hay problemas cargando maestros
  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error cargando datos maestros: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <FormInput className="h-12 w-12 mx-auto text-primary" />
        <h3 className="text-xl font-semibold">Revisar y Completar</h3>
        <p className="text-muted-foreground">
          Revisa los datos extraídos y completa la información faltante
        </p>
      </div>

      {/* Información del escaneo */}
      {scannedData && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Documento procesado exitosamente - {scannedData.porcentajeCompletitud}% completitud - {scannedData.camposExtraidos} campos extraídos
            </span>
          </div>
          
          {/* Información adicional del escaneo */}
          <div className="mt-2 grid grid-cols-2 gap-4 text-xs text-green-700">
            <div>
              <span className="font-medium">Estado:</span> {scannedData.estado}
            </div>
            <div>
              <span className="font-medium">Tiempo procesamiento:</span> {Math.round(scannedData.tiempoProcesamiento / 1000)}s
            </div>
            <div>
              <span className="font-medium">Cobertura:</span> {scannedData.datosVelneo?.datosCobertura?.cobertura}
            </div>
            <div>
              <span className="font-medium">Zona:</span> {scannedData.datosVelneo?.datosCobertura?.zonaCirculacion}
            </div>
          </div>
          
          {/* Mostrar cronograma de cuotas si existe */}
          {scannedData.datosVelneo?.condicionesPago?.detalleCuotas?.tieneCuotasDetalladas && (
            <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
              <span className="font-medium text-blue-800">
                📅 Cronograma extraído: {scannedData.datosVelneo.condicionesPago.detalleCuotas.cantidadTotal} cuotas 
                de ${scannedData.datosVelneo.condicionesPago.detalleCuotas.montoPromedio?.toLocaleString()} c/u
              </span>
            </div>
          )}
        </div>
      )}

      {/* Resumen de selecciones */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="font-medium mb-2">Resumen de Selecciones</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Cliente:</span>
            <p className="font-medium">{selectedClient?.clinom}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Compañía:</span>
            <p className="font-medium">{selectedCompany?.comnom}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Documento:</span>
            <p className="font-medium">{scannedData?.archivo}</p>
          </div>
        </div>
      </div>

      {/* Datos de la Póliza */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Datos de la Póliza</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Número de Póliza *</label>
              <input
                type="text"
                value={localFormData.numeroPoliza}
                onChange={(e) => updateField('numeroPoliza', e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Endoso</label>
              <input
                type="text"
                value={localFormData.endoso}
                onChange={(e) => updateField('endoso', e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Certificado</label>
              <input
                type="text"
                value={localFormData.certificado}
                onChange={(e) => updateField('certificado', e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Vigencia Desde *</label>
              <input
                type="date"
                value={localFormData.fechaDesde}
                onChange={(e) => updateField('fechaDesde', e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Vigencia Hasta *</label>
              <input
                type="date"
                value={localFormData.fechaHasta}
                onChange={(e) => updateField('fechaHasta', e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Datos del Vehículo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Datos del Vehículo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Marca y Modelo *</label>
              <input
                type="text"
                value={localFormData.marcaModelo}
                onChange={(e) => updateField('marcaModelo', e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Año</label>
              <input
                type="text"
                value={localFormData.anio}
                onChange={(e) => updateField('anio', e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Matrícula</label>
              <input
                type="text"
                value={localFormData.matricula}
                onChange={(e) => updateField('matricula', e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Motor</label>
              <input
                type="text"
                value={localFormData.motor}
                onChange={(e) => updateField('motor', e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Chasis</label>
              <input
                type="text"
                value={localFormData.chasis}
                onChange={(e) => updateField('chasis', e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {/* Selects de maestros */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Categoría</label>
              <select
                value={localFormData.categoriaId}
                onChange={(e) => updateField('categoriaId', parseInt(e.target.value))}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Seleccionar...</option>
                {masterData?.categorias?.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.catdsc}</option>
                ))}
              </select>
              {/* Mostrar valor extraído como ayuda */}
              {scannedData?.datosVelneo?.datosVehiculo?.categoria && (
                <p className="text-xs text-blue-600 mt-1">
                  Extraído: {scannedData.datosVelneo.datosVehiculo.categoria}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Destino</label>
              <select
                value={localFormData.destinoId}
                onChange={(e) => updateField('destinoId', parseInt(e.target.value))}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Seleccionar...</option>
                {masterData?.destinos?.map(dest => (
                  <option key={dest.id} value={dest.id}>{dest.desnom}</option>
                ))}
              </select>
              {scannedData?.datosVelneo?.datosVehiculo?.destino && (
                <p className="text-xs text-blue-600 mt-1">
                  Extraído: {scannedData.datosVelneo.datosVehiculo.destino}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Calidad</label>
              <select
                value={localFormData.calidadId}
                onChange={(e) => updateField('calidadId', parseInt(e.target.value))}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Seleccionar...</option>
                {masterData?.calidades?.map(cal => (
                  <option key={cal.id} value={cal.id}>{cal.caldsc}</option>
                ))}
              </select>
              {scannedData?.datosVelneo?.datosVehiculo?.calidad && (
                <p className="text-xs text-blue-600 mt-1">
                  Extraído: {scannedData.datosVelneo.datosVehiculo.calidad}
                </p>
              )}
            </div>
          </div>

          {/* Combustible en fila separada */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Combustible</label>
              <select
                value={localFormData.combustibleId}
                onChange={(e) => updateField('combustibleId', e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar...</option>
                {masterData?.combustibles?.map(comb => (
                  <option key={comb.id} value={comb.id}>{comb.name}</option>
                ))}
              </select>
              {scannedData?.datosVelneo?.datosVehiculo?.combustible && (
                <p className="text-xs text-blue-600 mt-1">
                  Extraído: {scannedData.datosVelneo.datosVehiculo.combustible}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DATOS DE COBERTURA - EDITABLES */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-cyan-600">🛡️ Datos de Cobertura</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Cobertura *</label>
              <select
                value={localFormData.coberturaId}
                onChange={(e) => updateField('coberturaId', parseInt(e.target.value))}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value={0}>Seleccionar...</option>
                {tarifasCompania?.map(tarifa => (
                  <option key={tarifa.id} value={tarifa.id}>{tarifa.nombre}</option>
                ))}
              </select>
              {scannedData?.datosVelneo?.datosCobertura?.cobertura && (
                <p className="text-xs text-blue-600 mt-1">
                  Extraído: {scannedData.datosVelneo.datosCobertura.cobertura}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Zona Circulación *</label>
              <select
                value={localFormData.zonaCirculacionId}
                onChange={(e) => updateField('zonaCirculacionId', parseInt(e.target.value))}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value={0}>Seleccionar...</option>
                {masterData?.departamentos?.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.nombre}</option>
                ))}
              </select>
              {(scannedData?.datosVelneo?.datosCobertura?.zonaCirculacion || scannedData?.datosVelneo?.datosBasicos?.departamento) && (
                <p className="text-xs text-blue-600 mt-1">
                  Extraído: {scannedData.datosVelneo?.datosCobertura?.zonaCirculacion || scannedData.datosVelneo?.datosBasicos?.departamento}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Moneda Cobertura</label>
              <select
                value={localFormData.monedaCoberturaId}
                onChange={(e) => updateField('monedaCoberturaId', parseInt(e.target.value))}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Seleccionar...</option>
                {masterData?.monedas?.map(moneda => (
                  <option key={moneda.id} value={moneda.id}>
                    {moneda.nombre} {moneda.simbolo ? `(${moneda.simbolo})` : ''}
                  </option>
                ))}
              </select>
              {scannedData?.datosVelneo?.datosCobertura?.moneda && (
                <p className="text-xs text-blue-600 mt-1">
                  Extraído: {scannedData.datosVelneo.datosCobertura.moneda}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Condiciones de Pago */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Condiciones de Pago</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Premio *</label>
              <input
                type="number"
                step="0.01"
                value={localFormData.premio}
                onChange={(e) => updateField('premio', parseFloat(e.target.value) || 0)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Total *</label>
              <input
                type="number"
                step="0.01"
                value={localFormData.total}
                onChange={(e) => updateField('total', parseFloat(e.target.value) || 0)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Cuotas</label>
              <input
                type="number"
                value={localFormData.cuotas}
                onChange={(e) => updateField('cuotas', parseInt(e.target.value) || 0)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Forma de Pago</label>
              <input
                type="text"
                value={localFormData.formaPago}
                onChange={(e) => updateField('formaPago', e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Valor Cuota</label>
              <input
                type="number"
                step="0.01"
                value={localFormData.valorCuota}
                onChange={(e) => updateField('valorCuota', parseFloat(e.target.value) || 0)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Moneda</label>
              <select
                value={localFormData.monedaId}
                onChange={(e) => updateField('monedaId', parseInt(e.target.value))}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Seleccionar...</option>
                {masterData?.monedas?.map(moneda => (
                  <option key={moneda.id} value={moneda.id}>
                    {moneda.nombre} {moneda.simbolo ? `(${moneda.simbolo})` : ''}
                  </option>
                ))}
              </select>
              {scannedData?.datosVelneo?.condicionesPago?.moneda && (
                <p className="text-xs text-blue-600 mt-1">
                  Extraído: {scannedData.datosVelneo.condicionesPago.moneda}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Datos Adicionales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Datos Adicionales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Dirección de Cobro</label>
            <input
              type="text"
              value={localFormData.direccionCobro}
              onChange={(e) => updateField('direccionCobro', e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Dirección donde se realiza el cobro"
            />
            <p className="text-xs text-gray-500 mt-1">
              Por defecto se usa la dirección del cliente, pero puede modificarse si es necesario
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Observaciones</label>
            <textarea
              value={localFormData.observaciones}
              onChange={(e) => updateField('observaciones', e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={8}
              placeholder="Observaciones adicionales..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Incluye información del procesamiento IA y cronograma de cuotas extraído
            </p>
          </div>
        </CardContent>
      </Card>

      {/* MOSTRAR CRONOGRAMA COMO REFERENCIA VISUAL (ya está en observaciones) */}
      {scannedData?.datosVelneo?.condicionesPago?.detalleCuotas?.tieneCuotasDetalladas && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-indigo-600">📅 Cronograma de Cuotas (Referencia)</CardTitle>
            <p className="text-sm text-muted-foreground">
              Este cronograma se ha incluido automáticamente en las observaciones para Velneo
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {scannedData.datosVelneo.condicionesPago.detalleCuotas.cuotas?.slice(0, 8).map((cuota: any, index: number) => (
                <div key={index} className="p-3 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm">Cuota {cuota.numero}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      cuota.estado === 'PENDIENTE' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {cuota.estado}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    📅 {new Date(cuota.fechaVencimiento).toLocaleDateString('es-UY')}
                  </div>
                  <div className="font-mono text-sm font-medium">
                    ${cuota.monto?.toLocaleString()}
                  </div>
                </div>
              )) || []}
              {(scannedData.datosVelneo.condicionesPago.detalleCuotas.cuotas?.length || 0) > 8 && (
                <div className="p-3 border rounded-lg bg-gray-50 text-center text-sm text-muted-foreground">
                  +{(scannedData.datosVelneo.condicionesPago.detalleCuotas.cuotas?.length || 0) - 8} cuotas más...
                  <br />
                  <span className="text-xs">Ver todas en observaciones</span>
                </div>
              )}
            </div>
            
            {/* Resumen del cronograma */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-600 font-medium">Primera cuota:</span>
                  <div className="font-mono">
                    {new Date(scannedData.datosVelneo.condicionesPago.detalleCuotas.primerVencimiento).toLocaleDateString('es-UY')}
                  </div>
                </div>
                <div>
                  <span className="text-blue-600 font-medium">Monto primera:</span>
                  <div className="font-mono">
                    ${scannedData.datosVelneo.condicionesPago.detalleCuotas.primaCuota?.toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="text-blue-600 font-medium">Total cuotas:</span>
                  <div className="font-mono">
                    {scannedData.datosVelneo.condicionesPago.detalleCuotas.cantidadTotal}
                  </div>
                </div>
                <div>
                  <span className="text-blue-600 font-medium">Promedio:</span>
                  <div className="font-mono">
                    ${scannedData.datosVelneo.condicionesPago.detalleCuotas.montoPromedio?.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botón de envío */}
      <div className="flex space-x-4">
        <Button 
          variant="outline"
          onClick={() => setCurrentStep('document')}
          disabled={isSubmitting}
        >
          Volver al Documento
        </Button>
        
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          size="lg"
          className="flex-1"
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

// ===== SUCCESS STEP COMPONENT =====
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

// ===== MAIN WIZARD COMPONENT =====
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