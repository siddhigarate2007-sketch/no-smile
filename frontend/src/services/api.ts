import type {
  Workspace,
  Project,
  Task,
  TaskStatus,
  TaskPriority,
  ProjectStatus,
  ProjectPriority,
  NotificationItem,
  ActivityLog,
  WorkspaceRole,
  DashboardStats,
} from '@/types';

const BASE_URL = '/api/v1';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include',
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || 'Request failed');
  }
  return data.data;
}

export const api = {
  // Workspaces
  workspaces: {
    list: () => fetchJson<Workspace[]>('/workspaces'),
    get: (id: string) => fetchJson<Workspace>(`/workspaces/${id}`),
    create: (data: { name: string; description?: string }) =>
      fetchJson<Workspace>('/workspaces', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: { name?: string; description?: string }) =>
      fetchJson<Workspace>(`/workspaces/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchJson<{ success: boolean }>(`/workspaces/${id}`, {
        method: 'DELETE',
      }),
  },

  // Projects
  projects: {
    list: (workspaceId: string, params?: { status?: string; search?: string }) => {
      const query = new URLSearchParams(params as any).toString();
      return fetchJson<Project[]>(
        `/workspaces/${workspaceId}/projects${query ? `?${query}` : ''}`
      );
    },
    get: (workspaceId: string, projectId: string) =>
      fetchJson<Project>(`/workspaces/${workspaceId}/projects/${projectId}`),
    create: (
      workspaceId: string,
      data: {
        name: string;
        description?: string;
        status?: ProjectStatus;
        priority?: ProjectPriority;
        startDate?: string;
        deadline?: string;
      }
    ) =>
      fetchJson<Project>(`/workspaces/${workspaceId}/projects`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (
      workspaceId: string,
      projectId: string,
      data: Partial<Project>
    ) =>
      fetchJson<Project>(`/workspaces/${workspaceId}/projects/${projectId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (workspaceId: string, projectId: string) =>
      fetchJson<{ success: boolean }>(
        `/workspaces/${workspaceId}/projects/${projectId}`,
        { method: 'DELETE' }
      ),
  },

  // Tasks & Kanban
  tasks: {
    list: (
      workspaceId: string,
      params?: { status?: string; priority?: string; search?: string }
    ) => {
      const query = new URLSearchParams(params as any).toString();
      return fetchJson<Task[]>(
        `/workspaces/${workspaceId}/tasks${query ? `?${query}` : ''}`
      );
    },
    get: (workspaceId: string, taskId: string) =>
      fetchJson<Task>(`/workspaces/${workspaceId}/tasks/${taskId}`),
    create: (
      workspaceId: string,
      data: {
        title: string;
        description?: string;
        status?: TaskStatus;
        priority?: TaskPriority;
        dueDate?: string;
        projectId: string;
        assigneeId?: string;
      }
    ) =>
      fetchJson<Task>(`/workspaces/${workspaceId}/tasks`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    updateStatus: (
      workspaceId: string,
      taskId: string,
      status: TaskStatus,
      orderIndex?: number
    ) =>
      fetchJson<Task>(`/workspaces/${workspaceId}/tasks/${taskId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, orderIndex }),
      }),
    update: (workspaceId: string, taskId: string, data: Partial<Task>) =>
      fetchJson<Task>(`/workspaces/${workspaceId}/tasks/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (workspaceId: string, taskId: string) =>
      fetchJson<{ success: boolean }>(`/workspaces/${workspaceId}/tasks/${taskId}`, {
        method: 'DELETE',
      }),
  },

  // Collaboration
  team: {
    listMembers: (workspaceId: string) =>
      fetchJson<any[]>(`/workspaces/${workspaceId}/members`),
    updateRole: (workspaceId: string, memberId: string, role: WorkspaceRole) =>
      fetchJson<any>(`/workspaces/${workspaceId}/members/${memberId}`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      }),
    removeMember: (workspaceId: string, memberId: string) =>
      fetchJson<any>(`/workspaces/${workspaceId}/members/${memberId}`, {
        method: 'DELETE',
      }),
    invite: (workspaceId: string, email: string, role: WorkspaceRole) =>
      fetchJson<any>(`/workspaces/${workspaceId}/invitations`, {
        method: 'POST',
        body: JSON.stringify({ email, role }),
      }),
  },

  // Activities & Analytics
  activities: {
    list: (workspaceId: string) =>
      fetchJson<ActivityLog[]>(`/workspaces/${workspaceId}/activities`),
  },
  analytics: {
    get: (workspaceId: string) =>
      fetchJson<DashboardStats>(`/workspaces/${workspaceId}/analytics`),
  },

  // Notifications
  notifications: {
    list: () => fetchJson<NotificationItem[]>('/notifications'),
    markRead: (id: string) =>
      fetchJson<any>(`/notifications/${id}/read`, { method: 'PATCH' }),
    markAllRead: () =>
      fetchJson<any>('/notifications/read-all', { method: 'PATCH' }),
  },
};
