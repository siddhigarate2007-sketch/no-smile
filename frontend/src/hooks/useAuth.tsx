import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, Workspace } from '@/types';
import { safeStorage } from '@/utils/storage';

interface AuthContextType {
  user: User | null;
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  selectWorkspace: (workspace: Workspace) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial fallback mock data for seamless instant preview if backend is connecting
const DEMO_USER: User = {
  id: 'usr-1',
  name: 'Alex Rivera',
  email: 'alex.rivera@devflow.io',
  avatar: null,
  bio: 'Staff Software Architect & Engineering Lead at DevFlow.',
  createdAt: new Date().toISOString(),
};

const DEMO_WORKSPACES: Workspace[] = [
  {
    id: 'ws-1',
    name: 'DevFlow Engineering',
    description: 'Core platform engineering and cloud infrastructure.',
    role: 'OWNER',
    memberCount: 8,
    projectCount: 6,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ws-2',
    name: 'Product & Design',
    description: 'Design systems, UI kits, user research and ergonomics.',
    role: 'ADMIN',
    memberCount: 5,
    projectCount: 3,
    createdAt: new Date().toISOString(),
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = safeStorage.getItem('devflow_user');
    return saved ? JSON.parse(saved) : DEMO_USER;
  });
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => {
    const saved = safeStorage.getItem('devflow_workspaces');
    return saved ? JSON.parse(saved) : DEMO_WORKSPACES;
  });
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(() => {
    const saved = safeStorage.getItem('devflow_current_ws');
    return saved ? JSON.parse(saved) : DEMO_WORKSPACES[0];
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshUser = async () => {
    try {
      const res = await fetch('/api/v1/auth/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.data?.user) {
          setUser(data.data.user);
          safeStorage.setItem('devflow_user', JSON.stringify(data.data.user));
          if (data.data.workspaces && data.data.workspaces.length > 0) {
            setWorkspaces(data.data.workspaces);
            safeStorage.setItem('devflow_workspaces', JSON.stringify(data.data.workspaces));
            if (!currentWorkspace || !data.data.workspaces.find((w: Workspace) => w.id === currentWorkspace.id)) {
              setCurrentWorkspace(data.data.workspaces[0]);
              safeStorage.setItem('devflow_current_ws', JSON.stringify(data.data.workspaces[0]));
            }
          }
        }
      }
    } catch (err) {
      // Backend not yet reachable or in dev mode
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password = 'Password123!') => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.data.user);
        setWorkspaces(data.data.workspaces || DEMO_WORKSPACES);
        const ws = data.data.workspaces?.[0] || DEMO_WORKSPACES[0];
        setCurrentWorkspace(ws);
        safeStorage.setItem('devflow_user', JSON.stringify(data.data.user));
        safeStorage.setItem('devflow_workspaces', JSON.stringify(data.data.workspaces || DEMO_WORKSPACES));
        safeStorage.setItem('devflow_current_ws', JSON.stringify(ws));
        return;
      }
    } catch {
      // Fallback in case backend is offline during frontend design phase
    } finally {
      setIsLoading(false);
    }

    // Demo fallback for preview
    const loggedUser: User = {
      id: 'usr-1',
      name: email.split('@')[0].replace('.', ' '),
      email,
      avatar: null,
      bio: 'Developer & Team Member',
      createdAt: new Date().toISOString(),
    };
    setUser(loggedUser);
    setWorkspaces(DEMO_WORKSPACES);
    setCurrentWorkspace(DEMO_WORKSPACES[0]);
    safeStorage.setItem('devflow_user', JSON.stringify(loggedUser));
    safeStorage.setItem('devflow_workspaces', JSON.stringify(DEMO_WORKSPACES));
    safeStorage.setItem('devflow_current_ws', JSON.stringify(DEMO_WORKSPACES[0]));
  };

  const register = async (name: string, email: string, password = 'Password123!') => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.data.user);
        setWorkspaces(data.data.workspaces || DEMO_WORKSPACES);
        const ws = data.data.workspaces?.[0] || DEMO_WORKSPACES[0];
        setCurrentWorkspace(ws);
        safeStorage.setItem('devflow_user', JSON.stringify(data.data.user));
        safeStorage.setItem('devflow_workspaces', JSON.stringify(data.data.workspaces || DEMO_WORKSPACES));
        safeStorage.setItem('devflow_current_ws', JSON.stringify(ws));
        return;
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }

    const newUser: User = {
      id: 'usr-' + Date.now(),
      name,
      email,
      avatar: null,
      bio: 'New DevFlow Member',
      createdAt: new Date().toISOString(),
    };
    const defaultWs: Workspace = {
      id: 'ws-' + Date.now(),
      name: `${name}'s Workspace`,
      description: 'Personal projects and sprint planning',
      role: 'OWNER',
      memberCount: 1,
      projectCount: 0,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    setWorkspaces([defaultWs]);
    setCurrentWorkspace(defaultWs);
    safeStorage.setItem('devflow_user', JSON.stringify(newUser));
    safeStorage.setItem('devflow_workspaces', JSON.stringify([defaultWs]));
    safeStorage.setItem('devflow_current_ws', JSON.stringify(defaultWs));
  };

  const logout = async () => {
    try {
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // ignore
    }
    setUser(null);
    setCurrentWorkspace(null);
    safeStorage.removeItem('devflow_user');
    safeStorage.removeItem('devflow_workspaces');
    safeStorage.removeItem('devflow_current_ws');
  };

  const selectWorkspace = (ws: Workspace) => {
    setCurrentWorkspace(ws);
    safeStorage.setItem('devflow_current_ws', JSON.stringify(ws));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        workspaces,
        currentWorkspace,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        selectWorkspace,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
