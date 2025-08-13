import * as React from "react";
import { cn } from "../../utils/cn";

interface ProgressProps {
  value?: number;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({ value = 0, className }) => {
  return (
    <div
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
    >
      <div
        className="h-full bg-primary transition-all duration-300 ease-in-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
};