import React from 'react';
import { cn } from '@/utils/cn';

export interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ src, name = 'User', size = 'md', className }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
    xl: 'w-16 h-16 text-xl',
  }[size];

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Color generator based on name hash for beautiful Apple-style pastel avatars
  const colors = [
    'bg-[#007AFF]/15 text-[#007AFF]',
    'bg-[#34C759]/15 text-[#248A3D]',
    'bg-[#AF52DE]/15 text-[#8944AB]',
    'bg-[#FF9500]/15 text-[#C97800]',
    'bg-[#5856D6]/15 text-[#5856D6]',
  ];
  const charCodeSum = name.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const colorClass = colors[charCodeSum % colors.length];

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          'rounded-full object-cover border border-[#E5E5EA]',
          sizeClasses,
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-medium select-none border border-black/5',
        sizeClasses,
        colorClass,
        className
      )}
    >
      {initials || 'U'}
    </div>
  );
}
