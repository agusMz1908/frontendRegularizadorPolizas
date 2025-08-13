import * as React from "react";
import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { Alert, AlertDescription } from "../../../shared/components/ui/alert";
import { Progress } from "../../../shared/components/ui/progress";
import { 
  Upload,
  FileText, 
  Loader2, 
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  X,
  File
} from "lucide-react";
import { usePoliza } from "../../../shared/hooks/usePoliza";

export const DocumentUpload: React.FC = () => {
  const { 
    scannedData,
    selectedClient,
    selectedCompany,
    selectedSection,
    isProcessingDocument,
    error,
    processDocument,
    setCurrentStep
  } = usePoliza();

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
      } else {
        alert("Por favor selecciona un archivo PDF");
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
      } else {
        alert("Por favor selecciona un archivo PDF");
      }
    }
  };

  const handleProcessFile = async () => {
    if (selectedFile) {
      console.log('📄 Procesando archivo:', selectedFile.name);
      await processDocument(selectedFile);
    }
  };

  const handleNext = () => {
    if (scannedData) {
      setCurrentStep('form');
    }
  };

  const handleBack = () => {
    setCurrentStep('company');
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <FileText className="h-12 w-12 mx-auto text-primary" />
        <h3 className="text-xl font-semibold">Escanear Documento</h3>
        <p className="text-muted-foreground">
          Sube el PDF de la póliza para procesamiento con Azure Document Intelligence
        </p>
      </div>

      {/* Selected Info */}
      <Card className="bg-muted/50">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-sm">
              <strong>Cliente:</strong> {selectedClient?.clinom}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-sm">
              <strong>Compañía:</strong> {selectedCompany?.comalias} - {selectedSection?.seccion}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* File Upload Area */}
      {!selectedFile && !scannedData && (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h4 className="text-lg font-medium mb-2">Subir Archivo PDF</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Arrastra el archivo PDF aquí o haz clic para seleccionar
          </p>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <Button asChild>
            <label htmlFor="file-upload" className="cursor-pointer">
              <File className="h-4 w-4 mr-2" />
              Seleccionar Archivo
            </label>
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Solo archivos PDF. Tamaño máximo: 10MB
          </p>
        </div>
      )}

      {/* Selected File */}
      {selectedFile && !scannedData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Archivo Seleccionado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-red-500" />
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                disabled={isProcessingDocument}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <Button 
              onClick={handleProcessFile} 
              className="w-full"
              disabled={isProcessingDocument}
            >
              {isProcessingDocument ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Procesando con IA...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Procesar con Azure Document Intelligence
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Processing Progress */}
      {isProcessingDocument && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <h4 className="font-medium">Procesando documento con IA</h4>
                <p className="text-sm text-muted-foreground">
                  Azure Document Intelligence está extrayendo los datos...
                </p>
              </div>
              <Progress value={undefined} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scan Results */}
      {scannedData && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-sm text-green-700 flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Documento Procesado Exitosamente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Archivo:</span>
                <p className="text-muted-foreground">{scannedData.archivo}</p>
              </div>
              <div>
                <span className="font-medium">Completitud:</span>
                <p className="text-muted-foreground">{scannedData.porcentajeCompletitud}%</p>
              </div>
              <div>
                <span className="font-medium">Campos extraídos:</span>
                <p className="text-muted-foreground">{scannedData.camposExtraidos}</p>
              </div>
              <div>
                <span className="font-medium">Campos faltantes:</span>
                <p className="text-muted-foreground">{scannedData.camposFaltantes?.length || 0}</p>
              </div>
            </div>

            {scannedData.datosVelneo && (
              <div className="mt-4 p-3 bg-white rounded border">
                <h5 className="font-medium text-sm mb-2">Datos Principales Extraídos:</h5>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {scannedData.datosVelneo.datosPoliza?.numeroPoliza && (
                    <div>
                      <span className="font-medium">Póliza:</span> {scannedData.datosVelneo.datosPoliza.numeroPoliza}
                    </div>
                  )}
                  {scannedData.datosVelneo.datosBasicos?.asegurado && (
                    <div>
                      <span className="font-medium">Asegurado:</span> {scannedData.datosVelneo.datosBasicos.asegurado}
                    </div>
                  )}
                  {scannedData.datosVelneo.datosVehiculo?.marcaModelo && (
                    <div>
                      <span className="font-medium">Vehículo:</span> {scannedData.datosVelneo.datosVehiculo.marcaModelo}
                    </div>
                  )}
                  {scannedData.datosVelneo.condicionesPago?.premio && (
                    <div>
                      <span className="font-medium">Premio:</span> ${scannedData.datosVelneo.condicionesPago.premio.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            )}

            {scannedData.camposFaltantes && scannedData.camposFaltantes.length > 0 && (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                Faltan algunos campos que deberás completar manualmente: {scannedData.camposFaltantes.join(', ')}
                </AlertDescription>
            </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Compañía
        </Button>

        {scannedData && (
          <Button onClick={handleNext}>
            <ArrowRight className="h-4 w-4 mr-2" />
            Continuar al Formulario
          </Button>
        )}
      </div>
    </div>
  );
};