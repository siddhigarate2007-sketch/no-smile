import React, { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-medium text-[#1D1D1F] tracking-tight"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'flex h-10 w-full appearance-none rounded-xl border border-[#E5E5EA] bg-white px-3.5 py-2 pr-9 text-sm text-[#1D1D1F] transition-colors focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 disabled:cursor-not-allowed disabled:bg-[#F5F5F7] disabled:text-[#86868B]',
              error && 'border-[#FF3B30] focus:border-[#FF3B30] focus:ring-[#FF3B30]/20',
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-[#86868B]" />
        </div>
        {error && <p className="text-xs text-[#FF3B30]">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
