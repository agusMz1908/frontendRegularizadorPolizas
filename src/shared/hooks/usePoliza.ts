import { usePolizaStore } from '../../app/store/polizaStore';

export const usePoliza = () => {
  const store = usePolizaStore();
  
  return {
    // Estado completo del store
    ...store,
    
    // Computed values
    canProceedToCompany: !!store.selectedClient,
    canProceedToDocument: !!store.selectedClient && !!store.selectedCompany && !!store.selectedSection,
    canProceedToForm: !!store.scannedData,
    canSubmit: !!store.formData && !!store.selectedClient && !!store.selectedCompany && !!store.selectedSection,
    
    // Helper methods
    isStepComplete: (step: string) => {
      switch (step) {
        case 'client':
          return !!store.selectedClient;
        case 'company':
          return !!store.selectedCompany && !!store.selectedSection;
        case 'document':
          return !!store.scannedData;
        case 'form':
          return !!store.formData;
        default:
          return false;
      }
    }
  };
};