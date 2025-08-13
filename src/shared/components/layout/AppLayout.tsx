import * as React from "react";
import { Button } from "../ui/button";
import { useAuth } from "../../hooks/useAuth";
import { 
  LogOut, 
  User, 
  FileText, 
  Users,
  TrendingUp,
  BarChart3,
  DollarSign,
  Settings
} from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, logout, tenantId } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">
              Regularizador de Pólizas
            </h1>
            <span className="text-sm text-muted-foreground">
              {tenantId}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <User className="h-4 w-4" />
              <span>{user?.nombre}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-card">
        <div className="flex h-12 items-center px-6 space-x-6">
          <NavItem icon={BarChart3} label="Dashboard" active />
          <NavItem icon={FileText} label="Pólizas" />
          <NavItem icon={Users} label="Clientes" />
          <NavItem icon={TrendingUp} label="Reportes" />
          <NavItem icon={DollarSign} label="Facturación" />
          <NavItem icon={Settings} label="Configuración" />
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {children}
      </main>
    </div>
  );
};

// Componente auxiliar para navegación
interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active = false }) => (
  <button
    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      active
        ? 'bg-primary text-primary-foreground'
        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
    }`}
  >
    <Icon className="h-4 w-4" />
    <span>{label}</span>
  </button>
);