import React, { type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center font-medium rounded-full px-2.5 py-0.5 text-xs transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-[#F5F5F7] text-[#1D1D1F] border border-[#E5E5EA]',
        primary: 'bg-[#007AFF]/10 text-[#007AFF] border border-[#007AFF]/20',
        success: 'bg-[#34C759]/10 text-[#248A3D] border border-[#34C759]/20',
        warning: 'bg-[#FF9F0A]/10 text-[#C97800] border border-[#FF9F0A]/20',
        danger: 'bg-[#FF3B30]/10 text-[#D70015] border border-[#FF3B30]/20',
        neutral: 'bg-[#86868B]/10 text-[#636366] border border-[#86868B]/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
