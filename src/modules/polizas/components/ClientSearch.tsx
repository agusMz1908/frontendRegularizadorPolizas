import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { Input } from "../../../shared/components/ui/input";
import { Label } from "../../../shared/components/ui/label";
import { Alert, AlertDescription } from "../../../shared/components/ui/alert";
import { 
  Search, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Loader2, 
  AlertCircle,
  IdCard,
  Users,
  ArrowRight
} from "lucide-react";
import { usePoliza } from "../../../shared/hooks/usePoliza";

interface ClientDto {
  id: number;
  clinom: string;
  cliruc: string;
  clidir: string;
  clitel?: string;
  cliemail?: string;
}

export const ClientSearch: React.FC = () => {
  const { 
    clients, 
    isLoading, 
    error, 
    searchClients, 
    setSelectedClient, 
    setCurrentStep,
    selectedClient 
  } = usePoliza();

  const [searchTerm, setSearchTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      if (term.trim().length >= 2) {
        searchClients(term);
        setHasSearched(true);
      }
    }, 500),
    [searchClients]
  );

  useEffect(() => {
    if (searchTerm.trim().length >= 2) {
      debouncedSearch(searchTerm);
    } else {
      setHasSearched(false);
    }
  }, [searchTerm, debouncedSearch]);

  const handleSelectClient = (client: ClientDto) => {
    console.log('👤 Seleccionando cliente:', client);
    setSelectedClient(client);
    setCurrentStep('company');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <Users className="h-12 w-12 mx-auto text-primary" />
        <h3 className="text-xl font-semibold">Seleccionar Cliente</h3>
        <p className="text-muted-foreground">
          Busca y selecciona el cliente para la nueva póliza
        </p>
      </div>

      {/* Search Input */}
      <div className="space-y-2">
        <Label htmlFor="client-search">Buscar Cliente</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            id="client-search"
            type="text"
            placeholder="Buscar por nombre o documento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            autoFocus
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Ingresa al menos 2 caracteres para buscar
        </p>
      </div>

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Buscando clientes...</p>
        </div>
      )}

      {/* Results */}
      {!isLoading && hasSearched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">
              {clients.length > 0 ? `${clients.length} cliente(s) encontrado(s)` : 'No se encontraron clientes'}
            </h4>
          </div>

          {clients.length > 0 && (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {clients.map((client: ClientDto) => (
                <ClientCard
                  key={client.id}
                  client={client}
                  onSelect={handleSelectClient}
                />
              ))}
            </div>
          )}

          {clients.length === 0 && hasSearched && !isLoading && (
            <div className="text-center py-8">
              <User className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                No se encontraron clientes con "{searchTerm}"
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Intenta con otro término de búsqueda
              </p>
            </div>
          )}
        </div>
      )}

      {/* Selected Client */}
      {selectedClient && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-sm text-primary">Cliente Seleccionado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">{selectedClient.clinom}</p>
                <p className="text-sm text-muted-foreground">Doc: {selectedClient.cliruc}</p>
              </div>
              <Button size="sm" onClick={() => setCurrentStep('company')}>
                <ArrowRight className="h-4 w-4 mr-2" />
                Continuar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Componente auxiliar para mostrar cliente
interface ClientCardProps {
  client: ClientDto;
  onSelect: (client: ClientDto) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onSelect }) => {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onSelect(client)}>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{client.clinom}</h4>
            <Button size="sm" variant="outline">
              Seleccionar
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <IdCard className="h-4 w-4" />
              <span>{client.cliruc}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{client.clidir}</span>
            </div>
            
            {client.clitel && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>{client.clitel}</span>
              </div>
            )}
            
            {client.cliemail && (
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="truncate">{client.cliemail}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Utility debounce function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}