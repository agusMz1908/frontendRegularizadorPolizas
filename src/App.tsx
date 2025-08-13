import * as React from "react";
import { useState } from "react";
import { ProtectedRoute } from "./app/router/ProtectedRoute";
import { AppLayout } from "./shared/components/layout/AppLayout";
import { Alert, AlertDescription } from "./shared/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "./shared/components/ui/card";
import { Button } from "./shared/components/ui/button";
import { FileText, Users, Building2, TrendingUp, Plus, ArrowLeft } from "lucide-react";
import { PolizaWizard } from "./modules/polizas/components/PolizaWizard";

type View = 'dashboard' | 'wizard';

// Componente Dashboard actualizado con navegación
interface DashboardProps {
  onNavigate: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      {/* Alert de bienvenida */}
      <Alert>
        <FileText className="h-4 w-4" />
        <AlertDescription>
          ¡Bienvenido al Sistema Regularizador de Pólizas! Autenticación funcionando correctamente.
        </AlertDescription>
      </Alert>

      {/* Acciones rápidas */}
      <div className="flex space-x-4">
        <Button 
          className="flex items-center space-x-2"
          onClick={() => onNavigate('wizard')}
        >
          <Plus className="h-4 w-4" />
          <span>Nueva Póliza</span>
        </Button>
        <Button variant="outline">Ver Clientes</Button>
        <Button variant="outline">Reportes</Button>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Pólizas"
          value="1,234"
          description="+20.1% desde el mes pasado"
          icon={FileText}
        />
        <MetricCard
          title="Clientes"
          value="456"
          description="+5.2% desde el mes pasado"
          icon={Users}
        />
        <MetricCard
          title="Compañías"
          value="12"
          description="Activas y configuradas"
          icon={Building2}
        />
        <MetricCard
          title="Precisión IA"
          value="87%"
          description="Promedio de aciertos"
          icon={TrendingUp}
        />
      </div>
    </div>
  );
};

// Componente auxiliar para métricas
interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description, icon: Icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

// Wrapper del Wizard con navegación de regreso
interface WizardWrapperProps {
  onBack: () => void;
}

const WizardWrapper: React.FC<WizardWrapperProps> = ({ onBack }) => {
  return (
    <div className="space-y-4">
      {/* Botón de regreso */}
      <div className="flex items-center">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver al Dashboard</span>
        </Button>
      </div>
      
      {/* Wizard completo */}
      <PolizaWizard />
    </div>
  );
};

// Componente principal de la aplicación
function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} />;
      case 'wizard':
        return <WizardWrapper onBack={() => setCurrentView('dashboard')} />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        {renderCurrentView()}
      </AppLayout>
    </ProtectedRoute>
  );
}

export default App;