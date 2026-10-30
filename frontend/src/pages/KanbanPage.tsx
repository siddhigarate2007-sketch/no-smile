import React, { useState } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, Clock, MoreHorizontal, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { Task, TaskStatus, TaskPriority } from '@/types';

interface KanbanColumn {
  id: TaskStatus;
  title: string;
  accent: string;
}

const COLUMNS: KanbanColumn[] = [
  { id: 'TODO', title: 'To Do', accent: '#86868B' },
  { id: 'IN_PROGRESS', title: 'In Progress', accent: '#007AFF' },
  { id: 'IN_REVIEW', title: 'In Review', accent: '#FF9F0A' },
  { id: 'COMPLETED', title: 'Completed', accent: '#34C759' },
];

const INITIAL_KANBAN_TASKS: Task[] = [
  {
    id: 'k-1',
    title: 'Migrate PostgreSQL schema to Prisma v6',
    description: 'Ensure UUIDs, foreign keys, and indexes are cleanly mapped.',
    status: 'TODO',
    priority: 'HIGH',
    dueDate: '2026-11-04',
    orderIndex: 0,
    projectId: 'p-1',
    workspaceId: 'ws-1',
    creatorId: 'u-1',
    assignee: { id: 'u-1', name: 'Alex Rivera', email: 'alex@devflow.io', createdAt: '2026-10-01' },
    createdAt: '2026-10-29T10:00:00Z',
    updatedAt: '2026-10-29T10:00:00Z',
  },
  {
    id: 'k-2',
    title: 'Implement Argon2id password hashing',
    description: 'Set memoryCost=65536, timeCost=3, parallelism=4.',
    status: 'IN_PROGRESS',
    priority: 'URGENT',
    dueDate: '2026-10-31',
    orderIndex: 0,
    projectId: 'p-1',
    workspaceId: 'ws-1',
    creatorId: 'u-1',
    assignee: { id: 'u-2', name: 'Sarah Chen', email: 'sarah@devflow.io', createdAt: '2026-10-01' },
    createdAt: '2026-10-28T10:00:00Z',
    updatedAt: '2026-10-29T10:00:00Z',
  },
  {
    id: 'k-3',
    title: 'Tone down UI shadows for Apple aesthetic',
    description: 'Refine box shadows to 0 2px 10px rgba(0,0,0,0.04).',
    status: 'IN_REVIEW',
    priority: 'MEDIUM',
    dueDate: '2026-11-02',
    orderIndex: 0,
    projectId: 'p-2',
    workspaceId: 'ws-1',
    creatorId: 'u-1',
    assignee: { id: 'u-3', name: 'Marcus Brody', email: 'marcus@devflow.io', createdAt: '2026-10-01' },
    createdAt: '2026-10-27T10:00:00Z',
    updatedAt: '2026-10-29T10:00:00Z',
  },
  {
    id: 'k-4',
    title: 'Docker compose setup with pgAdmin container',
    description: 'Containerized local workflow with volume mounts.',
    status: 'COMPLETED',
    priority: 'LOW',
    dueDate: '2026-10-26',
    orderIndex: 0,
    projectId: 'p-1',
    workspaceId: 'ws-1',
    creatorId: 'u-1',
    assignee: { id: 'u-1', name: 'Alex Rivera', email: 'alex@devflow.io', createdAt: '2026-10-01' },
    createdAt: '2026-10-24T10:00:00Z',
    updatedAt: '2026-10-26T10:00:00Z',
  },
];

// Sortable Kanban Card component
function SortableTaskCard({
  task,
  onClick,
}: {
  task: Task;
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id, data: { task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

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
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="p-4 rounded-xl bg-white border border-[#E5E5EA] shadow-apple hover:shadow-apple-md hover:border-[#007AFF]/40 cursor-grab active:cursor-grabbing transition-all space-y-3 select-none"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-xs font-semibold text-[#1D1D1F] leading-snug line-clamp-2">
          {task.title}
        </h4>
        <MoreHorizontal className="w-3.5 h-3.5 text-[#86868B] shrink-0 opacity-40 hover:opacity-100" />
      </div>

      {task.description && (
        <p className="text-[11px] text-[#86868B] line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-1 border-t border-[#E5E5EA]/50 text-[11px]">
        {getPriorityBadge(task.priority)}

        <div className="flex items-center gap-2">
          {task.dueDate && (
            <span className="text-[#86868B] flex items-center gap-1 text-[10px]">
              <Clock className="w-3 h-3 text-[#FF9F0A]" />
              {task.dueDate}
            </span>
          )}
          {task.assignee && (
            <Avatar name={task.assignee.name} size="sm" />
          )}
        </div>
      </div>
    </div>
  );
}

export function KanbanPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_KANBAN_TASKS);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New task form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [columnStatus, setColumnStatus] = useState<TaskStatus>('TODO');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [dueDate, setDueDate] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Check if dropped onto a column directly or another card
    let targetStatus: TaskStatus | null = null;
    if (COLUMNS.some((col) => col.id === overId)) {
      targetStatus = overId as TaskStatus;
    } else {
      const overTask = tasks.find((t) => t.id === overId);
      if (overTask) {
        targetStatus = overTask.status;
      }
    }

    if (targetStatus) {
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === activeId ? { ...t, status: targetStatus as TaskStatus } : t
        )
      );
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: 'k-' + Date.now(),
      title,
      description,
      status: columnStatus,
      priority,
      dueDate: dueDate || null,
      orderIndex: 0,
      projectId: 'p-1',
      workspaceId: 'ws-1',
      creatorId: 'u-1',
      assignee: { id: 'u-1', name: 'Alex Rivera', email: 'alex@devflow.io', createdAt: '2026-10-01' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTasks([newTask, ...tasks]);
    setTitle('');
    setDescription('');
    setDueDate('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">Kanban Board</h2>
          <p className="text-xs text-[#86868B] mt-0.5">
            Interactive drag-and-drop task progression across 4 sprint stages
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setColumnStatus('TODO');
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4" /> Add Card
        </Button>
      </div>

      {/* Kanban Board Container */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
          {COLUMNS.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);

            return (
              <div
                key={col.id}
                className="flex flex-col rounded-2xl bg-[#F5F5F7]/80 border border-[#E5E5EA] p-3.5 min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: col.accent }}
                    />
                    <h3 className="text-xs font-semibold text-[#1D1D1F] uppercase tracking-wider">
                      {col.title}
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold text-[#86868B] bg-white px-2 py-0.5 rounded-full border border-[#E5E5EA]">
                    {colTasks.length}
                  </span>
                </div>

                {/* Cards Container with SortableContext */}
                <SortableContext
                  id={col.id}
                  items={colTasks.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex-1 space-y-3 pt-1">
                    {colTasks.map((task) => (
                      <SortableTaskCard
                        key={task.id}
                        task={task}
                        onClick={() => setActiveTask(task)}
                      />
                    ))}

                    {colTasks.length === 0 && (
                      <div className="h-32 flex items-center justify-center border-2 border-dashed border-[#E5E5EA] rounded-xl text-center p-4">
                        <span className="text-xs text-[#86868B]">
                          Drop tasks here
                        </span>
                      </div>
                    )}
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </div>
      </DndContext>

      {/* Task Details Modal */}
      {activeTask && (
        <Modal
          isOpen={!!activeTask}
          onClose={() => setActiveTask(null)}
          title={activeTask.title}
          description={`Created on ${new Date(activeTask.createdAt).toLocaleDateString()}`}
        >
          <div className="space-y-4">
            <div>
              <span className="text-xs font-medium text-[#86868B]">Description</span>
              <p className="text-xs text-[#1D1D1F] mt-1 leading-relaxed">
                {activeTask.description || 'No detailed description provided.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#E5E5EA]">
              <div>
                <span className="text-xs font-medium text-[#86868B]">Status</span>
                <p className="text-xs font-semibold text-[#1D1D1F] mt-1">
                  {activeTask.status.replace('_', ' ')}
                </p>
              </div>

              <div>
                <span className="text-xs font-medium text-[#86868B]">Priority</span>
                <p className="text-xs font-semibold text-[#1D1D1F] mt-1">
                  {activeTask.priority}
                </p>
              </div>
            </div>

            {activeTask.dueDate && (
              <div>
                <span className="text-xs font-medium text-[#86868B]">Due Date</span>
                <p className="text-xs text-[#1D1D1F] mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#007AFF]" />
                  {activeTask.dueDate}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <Button size="sm" onClick={() => setActiveTask(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Card Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Kanban Card"
        description="Create a task directly into the sprint pipeline"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input
            label="Card Title"
            placeholder="e.g. Audit cookie SameSite policy"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-medium text-[#1D1D1F]">Description</label>
            <textarea
              rows={3}
              className="flex w-full rounded-xl border border-[#E5E5EA] bg-white px-3.5 py-2 text-sm text-[#1D1D1F] placeholder:text-[#86868B] focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all resize-none"
              placeholder="Card details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Column Stage"
              options={[
                { label: 'To Do', value: 'TODO' },
                { label: 'In Progress', value: 'IN_PROGRESS' },
                { label: 'In Review', value: 'IN_REVIEW' },
                { label: 'Completed', value: 'COMPLETED' },
              ]}
              value={columnStatus}
              onChange={(e) => setColumnStatus(e.target.value as TaskStatus)}
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
            label="Target Due Date"
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
              Add to Board
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
