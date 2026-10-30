import React, { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-[4px] transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog Content */}
      <div
        className={cn(
          'relative w-full rounded-2xl bg-white p-6 shadow-apple-lg border border-[#E5E5EA] z-10 transition-all animate-in zoom-in-95 duration-200',
          maxWidthClass
        )}
      >
        <div className="flex items-start justify-between pb-4">
          <div>
            {title && (
              <h2 className="text-lg font-semibold text-[#1D1D1F] tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xs text-[#86868B] mt-0.5">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-[#86868B] hover:bg-[#F5F5F7] hover:text-[#1D1D1F] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="pt-2">{children}</div>
      </div>
    </div>
  );
}
