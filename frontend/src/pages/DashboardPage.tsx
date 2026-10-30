import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, currentWorkspace } = useAuth();

  // Metrics (backed by state/data)
  const stats = {
    totalProjects: 8,
    activeProjects: 5,
    totalTasks: 42,
    completedTasks: 26,
    pendingTasks: 13,
    overdueTasks: 3,
  };

  const productivityData = [
    { day: 'Mon', completed: 4 },
    { day: 'Tue', completed: 7 },
    { day: 'Wed', completed: 5 },
    { day: 'Thu', completed: 8 },
    { day: 'Fri', completed: 6 },
    { day: 'Sat', completed: 2 },
    { day: 'Sun', completed: 1 },
  ];

  const statusDistribution = [
    { name: 'Completed', value: 26, color: '#34C759' },
    { name: 'In Progress', value: 9, color: '#007AFF' },
    { name: 'In Review', value: 4, color: '#FF9F0A' },
    { name: 'To Do', value: 3, color: '#86868B' },
  ];

  const recentProjects = [
    {
      id: 'proj-1',
      name: 'DevFlow Cloud Infrastructure',
      description: 'Zero-downtime PostgreSQL replication & container clusters',
      status: 'ACTIVE',
      priority: 'HIGH',
      progress: 75,
      tasksCount: 14,
    },
    {
      id: 'proj-2',
      name: 'Design System 2.0 (SF Minimal)',
      description: 'Component library with keyboard navigation & theme tokens',
      status: 'ACTIVE',
      priority: 'MEDIUM',
      progress: 90,
      tasksCount: 8,
    },
    {
      id: 'proj-3',
      name: 'Mobile PWA Experience',
      description: 'Offline sync & touch gestures for iOS & Android Safari',
      status: 'PLANNING',
      priority: 'MEDIUM',
      progress: 20,
      tasksCount: 12,
    },
  ];

  const upcomingDeadlines = [
    {
      id: 'task-1',
      title: 'Finalize Argon2id session expiration policy',
      project: 'DevFlow Cloud Infrastructure',
      due: 'Tomorrow, 5:00 PM',
      priority: 'URGENT',
    },
    {
      id: 'task-2',
      title: 'Review dnd-kit collision detection bugfix',
      project: 'Design System 2.0',
      due: 'Nov 2, 2026',
      priority: 'HIGH',
    },
    {
      id: 'task-3',
      title: 'Audit Docker compose health checks',
      project: 'DevFlow Cloud Infrastructure',
      due: 'Nov 4, 2026',
      priority: 'MEDIUM',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome & Quick Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Engineer'}
          </h2>
          <p className="text-xs text-[#86868B] mt-1">
            Workspace: <span className="font-semibold text-[#1D1D1F]">{currentWorkspace?.name}</span> • Here is your sprint velocity overview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/projects')}
          >
            <FolderKanban className="w-4 h-4" />
            View Projects
          </Button>
          <Button
            size="sm"
            onClick={() => navigate('/kanban')}
          >
            <Plus className="w-4 h-4" />
            Open Kanban
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between text-[#86868B]">
            <span className="text-xs font-medium">Active Projects</span>
            <FolderKanban className="w-4 h-4 text-[#007AFF]" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#1D1D1F]">
              {stats.activeProjects}
            </span>
            <span className="text-xs text-[#86868B]">
              of {stats.totalProjects} total
            </span>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between text-[#86868B]">
            <span className="text-xs font-medium">Completed Tasks</span>
            <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#1D1D1F]">
              {stats.completedTasks}
            </span>
            <span className="text-xs text-[#34C759] font-medium">
              62% done
            </span>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between text-[#86868B]">
            <span className="text-xs font-medium">Pending Tasks</span>
            <Clock className="w-4 h-4 text-[#FF9F0A]" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#1D1D1F]">
              {stats.pendingTasks}
            </span>
            <span className="text-xs text-[#FF9F0A] font-medium">
              In progress
            </span>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between text-[#86868B]">
            <span className="text-xs font-medium">Overdue</span>
            <AlertTriangle className="w-4 h-4 text-[#FF3B30]" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#FF3B30]">
              {stats.overdueTasks}
            </span>
            <span className="text-xs text-[#FF3B30] font-medium">
              Needs action
            </span>
          </div>
        </Card>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Productivity Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#007AFF]" /> Weekly Productivity
              </CardTitle>
              <CardDescription>
                Tasks completed across the current 7-day sprint cycle
              </CardDescription>
            </div>
            <Badge variant="primary">33 tasks shipped</Badge>
          </CardHeader>
          <CardContent className="h-64 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productivityData}>
                <XAxis
                  dataKey="day"
                  stroke="#86868B"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#E5E5EA' }}
                />
                <YAxis
                  stroke="#86868B"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#E5E5EA' }}
                />
                <Tooltip
                  cursor={{ fill: '#F5F5F7' }}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #E5E5EA',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    fontSize: '12px',
                  }}
                />
                <Bar
                  dataKey="completed"
                  fill="#007AFF"
                  radius={[6, 6, 0, 0]}
                  name="Completed"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Status Distribution Donut */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Task Distribution</CardTitle>
            <CardDescription>Status breakdown across all projects</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-2 gap-2 w-full mt-2 text-xs">
              {statusDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[#86868B]">{item.name}</span>
                  <span className="font-semibold text-[#1D1D1F] ml-auto">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects & Deadlines 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base">Recent Projects</CardTitle>
              <CardDescription>Active initiatives within this workspace</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/projects')}
            >
              View all <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProjects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => navigate(`/projects`)}
                className="p-3.5 rounded-xl border border-[#E5E5EA] hover:border-[#007AFF]/40 hover:bg-[#F5F5F7]/40 cursor-pointer transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#1D1D1F]">
                    {proj.name}
                  </span>
                  <Badge variant={proj.priority === 'HIGH' ? 'danger' : 'primary'}>
                    {proj.priority}
                  </Badge>
                </div>
                <p className="text-xs text-[#86868B] line-clamp-1">{proj.description}</p>
                <div className="flex items-center gap-3 pt-1">
                  <div className="w-full bg-[#E5E5EA] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#007AFF] h-full rounded-full transition-all duration-300"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-[#86868B] shrink-0">
                    {proj.progress}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base">Upcoming Deadlines</CardTitle>
              <CardDescription>Priority deliverables scheduled soon</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/calendar')}
            >
              Calendar <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingDeadlines.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between p-3 rounded-xl border border-[#E5E5EA] bg-[#F5F5F7]/30 hover:bg-[#F5F5F7]/60 transition-colors"
              >
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-[#1D1D1F]">{item.title}</p>
                  <p className="text-[11px] text-[#86868B]">{item.project}</p>
                  <p className="text-[10px] text-[#FF3B30] font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Due {item.due}
                  </p>
                </div>
                <Badge variant={item.priority === 'URGENT' ? 'danger' : 'warning'}>
                  {item.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
