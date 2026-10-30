export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'MEMBER';

export type ProjectStatus = 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED';
export type ProjectPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type NotificationType =
  | 'TASK_ASSIGNED'
  | 'TASK_COMMENT'
  | 'PROJECT_INVITATION'
  | 'UPCOMING_DEADLINE'
  | 'STATUS_CHANGED';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  bio?: string | null;
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string | null;
  role?: WorkspaceRole;
  memberCount?: number;
  projectCount?: number;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate?: string | null;
  deadline?: string | null;
  workspaceId: string;
  taskCount?: number;
  completedTaskCount?: number;
  progress?: number;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  orderIndex: number;
  projectId: string;
  projectName?: string;
  workspaceId: string;
  creatorId: string;
  creatorName?: string;
  assigneeId?: string | null;
  assignee?: User | null;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  userId: string;
  user: User;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: string | null;
  workspaceId: string;
  userId: string;
  user: {
    name: string;
    email: string;
    avatar?: string | null;
  };
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  link?: string | null;
  createdAt: string;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  weeklyProductivity: { day: string; tasks: number }[];
  taskStatusDistribution: { name: string; count: number; color: string }[];
  projectProgress: { name: string; progress: number }[];
  recentActivities: ActivityLog[];
  upcomingDeadlines: Task[];
  recentProjects: Project[];
}
