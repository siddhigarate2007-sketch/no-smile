import React, { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary:
          'bg-[#007AFF] text-white hover:bg-[#0062CC] shadow-sm shadow-[#007AFF]/20',
        secondary:
          'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E5E5EA] border border-[#E5E5EA]',
        outline:
          'border border-[#E5E5EA] text-[#1D1D1F] hover:bg-[#F5F5F7] bg-white',
        ghost:
          'text-[#1D1D1F] hover:bg-[#F5F5F7]',
        danger:
          'bg-[#FF3B30] text-white hover:bg-[#D70015] shadow-sm shadow-[#FF3B30]/20',
        subtle:
          'bg-[#007AFF]/10 text-[#007AFF] hover:bg-[#007AFF]/15',
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
        md: 'h-9 px-4 text-sm rounded-xl gap-2',
        lg: 'h-11 px-5 text-base rounded-xl gap-2.5',
        icon: 'h-9 w-9 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
