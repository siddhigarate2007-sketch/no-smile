import React, { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-[#1D1D1F] tracking-tight"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-xl border border-[#E5E5EA] bg-white px-3.5 py-2 text-sm text-[#1D1D1F] placeholder:text-[#86868B] transition-colors focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 disabled:cursor-not-allowed disabled:bg-[#F5F5F7] disabled:text-[#86868B]',
            error && 'border-[#FF3B30] focus:border-[#FF3B30] focus:ring-[#FF3B30]/20',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-[#FF3B30] font-normal">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-xs text-[#86868B]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
