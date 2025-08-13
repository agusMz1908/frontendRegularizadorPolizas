import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
  placeholder?: string;
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  onSelect?: (value: string) => void;
}

interface SelectValueProps {
  placeholder?: string;
}

// Context para el Select
const SelectContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

// Componente principal Select
export const Select: React.FC<SelectProps> = ({ 
  value, 
  onValueChange, 
  children, 
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const contextValue = React.useMemo(() => ({
    value,
    onValueChange,
    isOpen,
    setIsOpen,
  }), [value, onValueChange, isOpen]);

  return (
    <SelectContext.Provider value={contextValue}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

// SelectTrigger
export const SelectTrigger: React.FC<SelectTriggerProps> = ({ 
  children, 
  className 
}) => {
  const { isOpen, setIsOpen } = React.useContext(SelectContext);

  return (
    <button
      type="button"
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={() => setIsOpen(!isOpen)}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
};

// SelectContent
export const SelectContent: React.FC<SelectContentProps> = ({ 
  children, 
  className 
}) => {
  const { isOpen } = React.useContext(SelectContext);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "absolute top-full left-0 z-50 w-full mt-1 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
        className
      )}
    >
      <div className="p-1">
        {children}
      </div>
    </div>
  );
};

// SelectItem
export const SelectItem: React.FC<SelectItemProps> = ({ 
  value, 
  children, 
  className 
}) => {
  const { onValueChange, setIsOpen } = React.useContext(SelectContext);

  const handleSelect = () => {
    onValueChange?.(value);
    setIsOpen(false);
  };

  return (
    <div
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
        className
      )}
      onClick={handleSelect}
    >
      {children}
    </div>
  );
};

// SelectValue
export const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => {
  const { value } = React.useContext(SelectContext);

  return (
    <span className="block truncate">
      {value || placeholder}
    </span>
  );
};

// Exports adicionales para compatibilidad
export const SelectGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const SelectLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="py-1.5 pl-2 pr-2 text-sm font-semibold">{children}</div>
);
export const SelectSeparator = () => <div className="my-1 h-px bg-muted" />;