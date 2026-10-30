import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Calendar as CalendarIcon,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Avatar } from '@/components/ui/Avatar';
import type { Task, TaskStatus, TaskPriority } from '@/types';

const INITIAL_TASKS: Task[] = [
  {
    id: 't-1',
    title: 'Configure Argon2id password hashing and session rotation',
    description: 'Ensure sessions are persisted to PostgreSQL with HttpOnly secure cookie flags.',
    status: 'IN_PROGRESS',
    priority: 'URGENT',
    dueDate: '2026-11-02',
    orderIndex: 0,
    projectId: 'proj-1',
    projectName: 'Cloud Infrastructure',
    workspaceId: 'ws-1',
    creatorId: 'usr-1',
    assignee: {
      id: 'usr-1',
      name: 'Alex Rivera',
      email: 'alex@devflow.io',
      createdAt: '2026-10-01',
    },
    createdAt: '2026-10-25T10:00:00Z',
    updatedAt: '2026-10-25T10:00:00Z',
  },
  {
    id: 't-2',
    title: 'Refactor Tailwind typography to Apple system font stack',
    description: 'Match SF Pro Text optical weights and line heights cleanly.',
    status: 'COMPLETED',
    priority: 'MEDIUM',
    dueDate: '2026-10-28',
    orderIndex: 1,
    projectId: 'proj-2',
    projectName: 'Design System 2.0',
    workspaceId: 'ws-1',
    creatorId: 'usr-1',
    assignee: {
      id: 'usr-2',
      name: 'Sarah Chen',
      email: 'sarah@devflow.io',
      createdAt: '2026-10-01',
    },
    createdAt: '2026-10-26T11:00:00Z',
    updatedAt: '2026-10-28T16:00:00Z',
  },
  {
    id: 't-3',
    title: 'Implement dnd-kit collision detection for multi-column board',
    description: 'Support keyboard navigation and pointer collision sensors with smooth drag animations.',
    status: 'IN_REVIEW',
    priority: 'HIGH',
    dueDate: '2026-11-05',
    orderIndex: 2,
    projectId: 'proj-3',
    projectName: 'Kanban Engine',
    workspaceId: 'ws-1',
    creatorId: 'usr-1',
    assignee: {
      id: 'usr-3',
      name: 'Marcus Brody',
      email: 'marcus@devflow.io',
      createdAt: '2026-10-01',
    },
    createdAt: '2026-10-27T09:00:00Z',
    updatedAt: '2026-10-29T14:00:00Z',
  },
  {
    id: 't-4',
    title: 'Write Supertest integration tests for Workspace isolation',
    description: 'Verify 403 Forbidden when accessing projects outside active user membership.',
    status: 'TODO',
    priority: 'HIGH',
    dueDate: '2026-11-08',
    orderIndex: 3,
    projectId: 'proj-4',
    projectName: 'Security Audit',
    workspaceId: 'ws-1',
    creatorId: 'usr-1',
    assignee: {
      id: 'usr-1',
      name: 'Alex Rivera',
      email: 'alex@devflow.io',
      createdAt: '2026-10-01',
    },
    createdAt: '2026-10-28T12:00:00Z',
    updatedAt: '2026-10-28T12:00:00Z',
  },
];

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New task form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [dueDate, setDueDate] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: 't-' + Date.now(),
      title,
      description,
      status,
      priority,
      dueDate: dueDate || null,
      orderIndex: tasks.length,
      projectId: 'proj-1',
      projectName: 'Cloud Infrastructure',
      workspaceId: 'ws-1',
      creatorId: 'usr-1',
      assignee: {
        id: 'usr-1',
        name: 'Alex Rivera',
        email: 'alex@devflow.io',
        createdAt: '2026-10-01',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTasks([newTask, ...tasks]);
    setTitle('');
    setDescription('');
    setDueDate('');
    setIsModalOpen(false);
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === taskId) {
          const nextStatus: TaskStatus =
            t.status === 'COMPLETED' ? 'TODO' : 'COMPLETED';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesPriority =
      priorityFilter === 'ALL' || t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case 'URGENT':
        return <Badge variant="danger">Urgent</Badge>;
      case 'HIGH':
        return <Badge variant="warning">High</Badge>;
      case 'MEDIUM':
        return <Badge variant="primary">Medium</Badge>;
      default:
        return <Badge variant="default">Low</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">Task Management</h2>
          <p className="text-xs text-[#86868B] mt-0.5">
            View, filter, and organize individual action items across all projects
          </p>
        </div>
        <Button size="sm" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" /> Create Task
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#86868B] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-white border border-[#E5E5EA] text-xs text-[#1D1D1F] placeholder:text-[#86868B] focus:border-[#007AFF] focus:outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-xl bg-white border border-[#E5E5EA] text-xs text-[#1D1D1F] focus:border-[#007AFF] focus:outline-none transition-all"
          >
            <option value="ALL">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="h-10 px-3 rounded-xl bg-white border border-[#E5E5EA] text-xs text-[#1D1D1F] focus:border-[#007AFF] focus:outline-none transition-all"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Tasks Table List */}
      <div className="rounded-2xl border border-[#E5E5EA] bg-white overflow-hidden shadow-apple">
        <div className="divide-y divide-[#E5E5EA]">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-[#F5F5F7]/50 transition-colors gap-3"
            >
              {/* Left: Checkbox + Title */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <button
                  onClick={() => toggleTaskStatus(task.id)}
                  className="mt-0.5 text-[#86868B] hover:text-[#007AFF] transition-colors"
                >
                  {task.status === 'COMPLETED' ? (
                    <CheckCircle2 className="w-5 h-5 text-[#34C759]" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div className="space-y-1 min-w-0">
                  <p
                    className={`text-xs font-semibold tracking-tight ${
                      task.status === 'COMPLETED'
                        ? 'line-through text-[#86868B]'
                        : 'text-[#1D1D1F]'
                    }`}
                  >
                    {task.title}
                  </p>
                  <p className="text-[11px] text-[#86868B] line-clamp-1">
                    {task.description}
                  </p>
                </div>
              </div>

              {/* Right: Meta pills */}
              <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#F5F5F7] text-[#86868B] border border-[#E5E5EA] hidden md:inline">
                  {task.projectName}
                </span>

                {getPriorityBadge(task.priority)}

                {task.dueDate && (
                  <span className="text-[11px] text-[#86868B] flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3" />
                    {task.dueDate}
                  </span>
                )}

                {task.assignee ? (
                  <Avatar name={task.assignee.name} size="sm" />
                ) : (
                  <User className="w-4 h-4 text-[#86868B]" />
                )}
              </div>
            </div>
          ))}

          {filteredTasks.length === 0 && (
            <div className="p-8 text-center text-xs text-[#86868B]">
              No tasks matched your criteria.
            </div>
          )}
        </div>
      </div>

      {/* Create Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Task"
        description="Add a task and assign it to an engineer"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Task Title"
            placeholder="e.g. Implement refresh token rotation"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-medium text-[#1D1D1F]">
              Description
            </label>
            <textarea
              rows={3}
              className="flex w-full rounded-xl border border-[#E5E5EA] bg-white px-3.5 py-2 text-sm text-[#1D1D1F] placeholder:text-[#86868B] focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all resize-none"
              placeholder="Add implementation specs or acceptance criteria..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Initial Status"
              options={[
                { label: 'To Do', value: 'TODO' },
                { label: 'In Progress', value: 'IN_PROGRESS' },
                { label: 'In Review', value: 'IN_REVIEW' },
                { label: 'Completed', value: 'COMPLETED' },
              ]}
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
            />

            <Select
              label="Priority"
              options={[
                { label: 'Low', value: 'LOW' },
                { label: 'Medium', value: 'MEDIUM' },
                { label: 'High', value: 'HIGH' },
                { label: 'Urgent', value: 'URGENT' },
              ]}
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
            />
          </div>

          <Input
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
