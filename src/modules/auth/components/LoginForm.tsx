import * as React from "react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { Input } from "../../../shared/components/ui/input";
import { Label } from "../../../shared/components/ui/label";
import { Alert, AlertDescription } from "../../../shared/components/ui/alert";
import { Loader2, Lock, User, AlertCircle } from "lucide-react";
import { useAuthStore } from "../../../app/store/authStore";

export const LoginForm: React.FC = () => {
  const { login, isLoading, error, clearError } = useAuthStore();
  const [credentials, setCredentials] = useState({
    nombre: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!credentials.nombre.trim() || !credentials.password.trim()) {
      return;
    }

    try {
      await login(credentials);
    } catch (error) {
      // Error ya manejado en el store
    }
  };

  const handleInputChange = (field: 'nombre' | 'password') => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCredentials(prev => ({
        ...prev,
        [field]: e.target.value
      }));
      if (error) clearError();
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Regularizador de Pólizas
          </h1>
          <p className="text-muted-foreground">
            Inicia sesión para continuar
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Usuario */}
              <div className="space-y-2">
                <Label htmlFor="usuario">Usuario</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="usuario"
                    type="text"
                    placeholder="Ingresa tu usuario"
                    value={credentials.nombre}
                    onChange={handleInputChange('nombre')}
                    className="pl-10"
                    disabled={isLoading}
                    autoComplete="username"
                    autoFocus
                    required
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    value={credentials.password}
                    onChange={handleInputChange('password')}
                    className="pl-10"
                    disabled={isLoading}
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !credentials.nombre.trim() || !credentials.password.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Iniciar Sesión
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Credenciales de prueba */}
        <div className="text-center text-sm text-muted-foreground space-y-1">
          <p><strong>Credenciales de prueba:</strong></p>
          <p>Usuario: <code className="bg-muted px-1 rounded">superadmin</code></p>
          <p>Contraseña: <code className="bg-muted px-1 rounded">string</code></p>
        </div>

        {/* Info del API */}
        <div className="text-center text-xs text-muted-foreground">
          <p>Conectando con: {import.meta.env.VITE_API_BASE_URL}</p>
        </div>
      </div>
    </div>
  );
};