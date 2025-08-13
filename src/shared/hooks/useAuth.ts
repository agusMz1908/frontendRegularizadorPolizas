import { useAuthStore } from '../../app/store/authStore';

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    initialize,
    clearError,
  } = useAuthStore();

  return {
    // Estado
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    
    // Acciones
    login,
    logout,
    initialize,
    clearError,
    
    // Computed
    isLoggedIn: isAuthenticated && !!user,
    userName: user?.nombre || '',
    tenantId: localStorage.getItem('tenantId') || '',
  };
};