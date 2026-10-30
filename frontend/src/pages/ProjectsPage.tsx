import React, { useState } from 'react';
import { Plus, Search, Filter, FolderKanban, Calendar, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { Project, ProjectStatus, ProjectPriority } from '@/types';

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'DevFlow Cloud Infrastructure',
    description: 'Zero-downtime PostgreSQL replication, session persistence, and Docker environments.',
    status: 'ACTIVE',
    priority: 'HIGH',
    startDate: '2026-10-01',
    deadline: '2026-11-15',
    workspaceId: 'ws-1',
    taskCount: 14,
    completedTaskCount: 10,
    progress: 71,
    createdAt: '2026-10-01T00:00:00Z',
  },
  {
    id: 'proj-2',
    name: 'Design System 2.0 (SF Minimal)',
    description: 'Apple-inspired component library with keyboard accessibility, tokens, and micro-interactions.',
    status: 'ACTIVE',
    priority: 'MEDIUM',
    startDate: '2026-10-10',
    deadline: '2026-11-30',
    workspaceId: 'ws-1',
    taskCount: 8,
    completedTaskCount: 7,
    progress: 88,
    createdAt: '2026-10-10T00:00:00Z',
  },
  {
    id: 'proj-3',
    name: 'Real-time Kanban Engine',
    description: 'Sub-millisecond drag-and-drop collision detection with persistent database synchronization.',
    status: 'PLANNING',
    priority: 'HIGH',
    startDate: '2026-10-20',
    deadline: '2026-12-01',
    workspaceId: 'ws-1',
    taskCount: 12,
    completedTaskCount: 2,
    progress: 17,
    createdAt: '2026-10-20T00:00:00Z',
  },
  {
    id: 'proj-4',
    name: 'Security Audit & RBAC Enforcement',
    description: 'Workspace-level isolation, CSRF protection, HttpOnly cookie auditing, and penetration tests.',
    status: 'COMPLETED',
    priority: 'HIGH',
    startDate: '2026-09-15',
    deadline: '2026-10-25',
    workspaceId: 'ws-1',
    taskCount: 10,
    completedTaskCount: 10,
    progress: 100,
    createdAt: '2026-09-15T00:00:00Z',
  },
];

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New Project Form state
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newStatus, setNewStatus] = useState<ProjectStatus>('PLANNING');
  const [newPriority, setNewPriority] = useState<ProjectPriority>('MEDIUM');
  const [newDeadline, setNewDeadline] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const created: Project = {
      id: 'proj-' + Date.now(),
      name: newName,
      description: newDesc,
      status: newStatus,
      priority: newPriority,
      startDate: new Date().toISOString().split('T')[0],
      deadline: newDeadline || null,
      workspaceId: 'ws-1',
      taskCount: 0,
      completedTaskCount: 0,
      progress: 0,
      createdAt: new Date().toISOString(),
    };

    setProjects([created, ...projects]);
    setNewName('');
    setNewDesc('');
    setNewDeadline('');
    setIsCreateOpen(false);
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: ProjectStatus) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'ACTIVE':
        return 'primary';
      case 'ON_HOLD':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">Projects</h2>
          <p className="text-xs text-[#86868B] mt-0.5">
            Organize roadmaps, sprints, and engineering initiatives
          </p>
        </div>
        <Button size="sm" onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4" /> Create Project
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#86868B] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-white border border-[#E5E5EA] text-xs text-[#1D1D1F] placeholder:text-[#86868B] focus:border-[#007AFF] focus:outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#86868B] hidden sm:block" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-xl bg-white border border-[#E5E5EA] text-xs text-[#1D1D1F] focus:border-[#007AFF] focus:outline-none transition-all w-full sm:w-auto"
          >
            <option value="ALL">All Statuses</option>
            <option value="PLANNING">Planning</option>
            <option value="ACTIVE">Active</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} hoverable className="flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#007AFF]/10 text-[#007AFF]">
                    <FolderKanban className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-[#1D1D1F] leading-snug">
                      {project.name}
                    </h3>
                  </div>
                </div>
                <Badge variant={getStatusBadgeVariant(project.status)}>
                  {project.status}
                </Badge>
              </div>

              <p className="text-xs text-[#86868B] mt-3 line-clamp-2 leading-relaxed">
                {project.description || 'No description provided.'}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E5E5EA]/60 space-y-3">
              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[#86868B]">Completion</span>
                  <span className="font-semibold text-[#1D1D1F]">{project.progress}%</span>
                </div>
                <div className="w-full bg-[#F5F5F7] h-2 rounded-full overflow-hidden border border-[#E5E5EA]/60">
                  <div
                    className="bg-[#007AFF] h-full rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Meta details */}
              <div className="flex items-center justify-between text-[11px] text-[#86868B] pt-1">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#34C759]" />
                  {project.completedTaskCount} / {project.taskCount} tasks
                </span>
                {project.deadline && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Due {project.deadline}
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-white border border-[#E5E5EA]">
          <FolderKanban className="w-8 h-8 text-[#86868B] mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-[#1D1D1F]">No projects found</h3>
          <p className="text-xs text-[#86868B] mt-1">
            Try adjusting your search query or create a new project.
          </p>
        </div>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Project"
        description="Add a new initiative to your workspace sprint roadmap"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Project Title"
            placeholder="e.g. Mobile PWA Redesign"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />

          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-medium text-[#1D1D1F]">Description</label>
            <textarea
              rows={3}
              className="flex w-full rounded-xl border border-[#E5E5EA] bg-white px-3.5 py-2 text-sm text-[#1D1D1F] placeholder:text-[#86868B] focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all resize-none"
              placeholder="Outline project goals and expected architecture..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Initial Status"
              options={[
                { label: 'Planning', value: 'PLANNING' },
                { label: 'Active', value: 'ACTIVE' },
                { label: 'On Hold', value: 'ON_HOLD' },
                { label: 'Completed', value: 'COMPLETED' },
              ]}
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as ProjectStatus)}
            />

            <Select
              label="Priority"
              options={[
                { label: 'Low', value: 'LOW' },
                { label: 'Medium', value: 'MEDIUM' },
                { label: 'High', value: 'HIGH' },
              ]}
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as ProjectPriority)}
            />
          </div>

          <Input
            label="Deadline Target"
            type="date"
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
