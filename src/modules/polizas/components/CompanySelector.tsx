import * as React from "react";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { Alert, AlertDescription } from "../../../shared/components/ui/alert";
import { 
  Building2, 
  Loader2, 
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2
} from "lucide-react";
import { usePoliza } from "../../../shared/hooks/usePoliza";

interface CompanyDto {
  id: number;
  comnom: string;
  comalias: string;
  activo: boolean;
}

interface SeccionDto {
  id: number;
  seccion: string;
  activo: boolean;
}

export const CompanySelector: React.FC = () => {
  const { 
    companies,
    sections,
    selectedCompany,
    selectedSection,
    selectedClient,
    isLoading,
    error,
    loadCompanies,
    loadSections,
    setSelectedCompany,
    setSelectedSection,
    setCurrentStep
  } = usePoliza();

  useEffect(() => {
    console.log('🏢 Cargando compañías y secciones...');
    loadCompanies();
    loadSections();
  }, [loadCompanies, loadSections]);

  const handleCompanySelect = (company: CompanyDto) => {
    console.log('🏢 Compañía seleccionada:', company);
    setSelectedCompany(company);
  };

  const handleSectionSelect = (section: SeccionDto) => {
    console.log('📂 Sección seleccionada:', section);
    setSelectedSection(section);
  };

  const handleNext = () => {
    if (selectedCompany && selectedSection) {
      console.log('➡️ Procediendo al escaneo de documento');
      setCurrentStep('document');
    }
  };

  const handleBack = () => {
    setCurrentStep('client');
  };

  const canProceed = selectedCompany && selectedSection;

  if (isLoading) {
    return (
      <div className="text-center space-y-4 py-12">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="text-muted-foreground">Cargando compañías y secciones...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <Building2 className="h-12 w-12 mx-auto text-primary" />
        <h3 className="text-xl font-semibold">Compañía y Ramo</h3>
        <p className="text-muted-foreground">
          Selecciona la compañía aseguradora y el ramo para {selectedClient?.clinom}
        </p>
      </div>

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Client Info */}
      {selectedClient && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm">
                <strong>Cliente:</strong> {selectedClient.clinom} - {selectedClient.cliruc}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Companies Selection */}
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-3">Compañía Aseguradora</h4>
          {companies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {companies.map((company: CompanyDto) => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  isSelected={selectedCompany?.id === company.id}
                  onSelect={handleCompanySelect}
                />
              ))}
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No se encontraron compañías disponibles.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Sections Selection */}
        <div>
          <h4 className="text-sm font-medium mb-3">Ramo/Sección</h4>
          {sections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {sections.map((section: SeccionDto) => (
                <SectionCard
                  key={section.id}
                  section={section}
                  isSelected={selectedSection?.id === section.id}
                  onSelect={handleSectionSelect}
                />
              ))}
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No se encontraron secciones disponibles.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* Selected Summary */}
      {selectedCompany && selectedSection && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-sm text-primary">Selección Actual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Compañía:</span>
              <span className="text-sm">{selectedCompany.comalias} - {selectedCompany.comnom}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Ramo:</span>
              <span className="text-sm">{selectedSection.seccion}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Cliente
        </Button>

        <Button 
          onClick={handleNext} 
          disabled={!canProceed}
        >
          <ArrowRight className="h-4 w-4 mr-2" />
          Continuar al Escaneo
        </Button>
      </div>
    </div>
  );
};

// Componente auxiliar para compañías
interface CompanyCardProps {
  company: CompanyDto;
  isSelected: boolean;
  onSelect: (company: CompanyDto) => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, isSelected, onSelect }) => {
  return (
    <Card 
      className={`cursor-pointer transition-all ${
        isSelected 
          ? 'border-primary ring-2 ring-primary/20 bg-primary/5' 
          : 'hover:shadow-md'
      }`}
      onClick={() => onSelect(company)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-medium">{company.comalias}</h4>
            <p className="text-sm text-muted-foreground">{company.comnom}</p>
          </div>
          {isSelected && (
            <CheckCircle2 className="h-5 w-5 text-primary" />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Componente auxiliar para secciones
interface SectionCardProps {
  section: SeccionDto;
  isSelected: boolean;
  onSelect: (section: SeccionDto) => void;
}

const SectionCard: React.FC<SectionCardProps> = ({ section, isSelected, onSelect }) => {
  return (
    <Card 
      className={`cursor-pointer transition-all ${
        isSelected 
          ? 'border-primary ring-2 ring-primary/20 bg-primary/5' 
          : 'hover:shadow-md'
      }`}
      onClick={() => onSelect(section)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-center w-full">
            <h4 className="font-medium text-sm">{section.seccion}</h4>
          </div>
          {isSelected && (
            <CheckCircle2 className="h-4 w-4 text-primary ml-2" />
          )}
        </div>
      </CardContent>
    </Card>
  );
};