import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function PublicLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7] text-[#1D1D1F]">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#E5E5EA]/80 bg-white/80 px-6 sm:px-12 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#007AFF] text-white shadow-sm shadow-[#007AFF]/30">
            <span className="font-semibold text-sm tracking-tight">DF</span>
          </div>
          <span className="font-semibold text-base text-[#1D1D1F] tracking-tight">
            DevFlow
          </span>
        </Link>

        {/* Center links on desktop */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-[#86868B]">
          <a href="#features" className="hover:text-[#1D1D1F] transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-[#1D1D1F] transition-colors">
            How It Works
          </a>
          <a href="#benefits" className="hover:text-[#1D1D1F] transition-colors">
            Benefits
          </a>
        </nav>

        {/* Auth CTAs */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/login')}
          >
            Log In
          </Button>
          <Button
            size="sm"
            onClick={() => navigate('/register')}
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Main Outlet */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5E5EA] bg-white py-12 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#86868B]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#007AFF] text-white">
              <span className="font-bold text-[10px]">DF</span>
            </div>
            <span className="font-semibold text-[#1D1D1F]">DevFlow SaaS</span>
            <span>— Precision productivity for modern engineering teams.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-[#1D1D1F] transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-[#1D1D1F] transition-colors">
              Terms of Service
            </a>
            <a href="#security" className="hover:text-[#1D1D1F] transition-colors">
              Security
            </a>
            <span>&copy; {new Date().getFullYear()} DevFlow Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
