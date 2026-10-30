import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  KanbanSquare,
  Calendar,
  Users,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  ChevronsUpDown,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Avatar } from '@/components/ui/Avatar';
import type { Workspace } from '@/types';

interface SidebarProps {
  currentWorkspace?: Workspace | null;
  workspaces?: Workspace[];
  onSelectWorkspace?: (workspace: Workspace) => void;
  user?: { name: string; email: string; avatar?: string | null } | null;
  onLogout?: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', path: '/projects', icon: FolderKanban },
  { name: 'Tasks', path: '/tasks', icon: CheckSquare },
  { name: 'Kanban Board', path: '/kanban', icon: KanbanSquare },
  { name: 'Calendar', path: '/calendar', icon: Calendar },
  { name: 'Team Members', path: '/team', icon: Users },
  { name: 'Notifications', path: '/notifications', icon: Bell },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar({
  currentWorkspace,
  workspaces = [],
  onSelectWorkspace,
  user,
  onLogout,
  isOpenMobile = false,
  onCloseMobile,
}: SidebarProps) {
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[#E5E5EA] bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0',
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-[#E5E5EA]/60">
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#007AFF] text-white shadow-sm shadow-[#007AFF]/30">
              <span className="font-semibold text-sm tracking-tight">DF</span>
            </div>
            <span className="font-semibold text-base text-[#1D1D1F] tracking-tight">
              DevFlow
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#F5F5F7] text-[#86868B] rounded-md border border-[#E5E5EA]">
            v1.0
          </span>
        </div>

        {/* Workspace Quick Switcher */}
        <div className="px-4 py-3 border-b border-[#E5E5EA]/40">
          <div className="relative group">
            <button className="w-full flex items-center justify-between p-2 rounded-xl border border-[#E5E5EA] bg-[#F5F5F7]/70 hover:bg-[#F5F5F7] transition-all text-left">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-6 h-6 rounded-lg bg-black text-white flex items-center justify-center text-xs font-semibold shrink-0">
                  {currentWorkspace?.name ? currentWorkspace.name[0] : 'W'}
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-[#1D1D1F] truncate">
                    {currentWorkspace?.name || 'My Workspace'}
                  </p>
                  <p className="text-[10px] text-[#86868B]">Workspace</p>
                </div>
              </div>
              <ChevronsUpDown className="w-3.5 h-3.5 text-[#86868B] shrink-0" />
            </button>

            {/* Dropdown menu */}
            <div className="hidden group-hover:block absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5E5EA] rounded-xl shadow-apple-md p-1 z-30">
              <p className="text-[10px] font-semibold text-[#86868B] px-2 py-1 uppercase tracking-wider">
                Workspaces
              </p>
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => onSelectWorkspace && onSelectWorkspace(ws)}
                  className={cn(
                    'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors',
                    currentWorkspace?.id === ws.id
                      ? 'bg-[#007AFF]/10 text-[#007AFF]'
                      : 'text-[#1D1D1F] hover:bg-[#F5F5F7]'
                  )}
                >
                  <span className="truncate">{ws.name}</span>
                  {currentWorkspace?.id === ws.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#007AFF]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150',
                    isActive
                      ? 'bg-[#007AFF] text-white shadow-sm shadow-[#007AFF]/25 font-semibold'
                      : 'text-[#1D1D1F] hover:bg-[#F5F5F7] hover:text-[#007AFF]'
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{item.name}</span>
                <ChevronRight className="h-3 w-3 opacity-40" />
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-[#E5E5EA]/60">
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#F5F5F7]/70 border border-[#E5E5EA]/60">
            <div
              className="flex items-center gap-2.5 cursor-pointer overflow-hidden flex-1"
              onClick={() => navigate('/profile')}
            >
              <Avatar name={user?.name || 'User'} size="sm" src={user?.avatar} />
              <div className="truncate">
                <p className="text-xs font-semibold text-[#1D1D1F] truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-[10px] text-[#86868B] truncate">
                  {user?.email || 'user@devflow.io'}
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-[#86868B] hover:text-[#FF3B30] hover:bg-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
