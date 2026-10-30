import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useAuth } from '@/hooks/useAuth';

export function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, currentWorkspace, workspaces, selectWorkspace } = useAuth();
  const location = useLocation();

  // Derive title from pathname
  const getPageTitle = (path: string) => {
    if (path.startsWith('/dashboard')) return 'Dashboard';
    if (path.startsWith('/projects')) return 'Projects';
    if (path.startsWith('/tasks')) return 'Task Management';
    if (path.startsWith('/kanban')) return 'Kanban Board';
    if (path.startsWith('/calendar')) return 'Calendar';
    if (path.startsWith('/team')) return 'Team Collaboration';
    if (path.startsWith('/notifications')) return 'Notifications';
    if (path.startsWith('/profile')) return 'My Profile';
    if (path.startsWith('/settings')) return 'Settings';
    return 'DevFlow';
  };

  return (
    <div className="flex h-screen w-full bg-[#F5F5F7] overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        currentWorkspace={currentWorkspace}
        workspaces={workspaces}
        onSelectWorkspace={selectWorkspace}
        user={user}
        onLogout={logout}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          title={getPageTitle(location.pathname)}
          unreadCount={user ? 2 : 0}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
