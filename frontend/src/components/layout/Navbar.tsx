import React from 'react';
import { Menu, Bell, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  title?: string;
  unreadCount?: number;
  onOpenCreateTask?: () => void;
}

export function Navbar({
  onToggleMobileMenu,
  title = 'Dashboard',
  unreadCount = 2,
  onOpenCreateTask,
}: NavbarProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#E5E5EA] bg-white/80 px-4 sm:px-8 backdrop-blur-md">
      {/* Left: Mobile Toggle + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-[#86868B] hidden sm:block">
            Workspace
          </span>
          <h1 className="text-base sm:text-lg font-semibold text-[#1D1D1F] tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden md:flex items-center max-w-sm w-full mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#86868B] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search tasks, projects, members... (Cmd + K)"
            className="w-full h-9 pl-9 pr-4 rounded-xl bg-[#F5F5F7] border border-transparent text-xs text-[#1D1D1F] placeholder:text-[#86868B] focus:border-[#007AFF] focus:bg-white focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {onOpenCreateTask && (
          <Button
            size="sm"
            onClick={onOpenCreateTask}
            className="shadow-apple"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Task</span>
          </Button>
        )}

        {/* Notifications Icon with Badge */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 rounded-xl text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-[#1D1D1F]" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-[#FF3B30] ring-2 ring-white" />
          )}
        </button>
      </div>
    </header>
  );
}
