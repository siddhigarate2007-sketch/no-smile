import prisma from '../config/prisma.js';
import { NotFoundError } from '../utils/errors.js';
import { TaskStatus, TaskPriority } from '@prisma/client';

export class TaskService {
  async listTasks(
    workspaceId: string,
    filters?: {
      projectId?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      assigneeId?: string;
      search?: string;
    }
  ) {
    const where: any = { workspaceId };

    if (filters?.projectId) where.projectId = filters.projectId;
    if (filters?.status) where.status = filters.status;
    if (filters?.priority) where.priority = filters.priority;
    if (filters?.assigneeId) where.assigneeId = filters.assigneeId;
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: [{ status: 'asc' }, { orderIndex: 'asc' }, { createdAt: 'desc' }],
      include: {
        project: {
          select: { id: true, name: true },
        },
        assignee: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        creator: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { comments: true },
        },
      },
    });

    return tasks.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      dueDate: t.dueDate,
      orderIndex: t.orderIndex,
      projectId: t.projectId,
      projectName: t.project.name,
      workspaceId: t.workspaceId,
      creatorId: t.creatorId,
      creatorName: t.creator.name,
      assigneeId: t.assigneeId,
      assignee: t.assignee,
      commentCount: t._count.comments,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));
  }

  async getTaskById(taskId: string, workspaceId: string) {
    const task = await prisma.task.findFirst({
      where: { id: taskId, workspaceId },
      include: {
        project: true,
        assignee: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        creator: {
          select: { id: true, name: true, email: true },
        },
        comments: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!task) throw new NotFoundError('Task not found');
    return task;
  }

  async createTask(
    workspaceId: string,
    creatorId: string,
    data: {
      title: string;
      description?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      dueDate?: Date;
      projectId: string;
      assigneeId?: string;
    }
  ) {
    return prisma.$transaction(async (tx) => {
      // Find highest orderIndex in column
      const count = await tx.task.count({
        where: {
          workspaceId,
          status: data.status || 'TODO',
        },
      });

      const task = await tx.task.create({
        data: {
          workspaceId,
          creatorId,
          projectId: data.projectId,
          title: data.title,
          description: data.description,
          status: data.status || 'TODO',
          priority: data.priority || 'MEDIUM',
          dueDate: data.dueDate,
          assigneeId: data.assigneeId,
          orderIndex: count,
        },
        include: {
          project: { select: { id: true, name: true } },
          assignee: { select: { id: true, name: true, email: true, avatar: true } },
        },
      });

      // Audit log
      await tx.activityLog.create({
        data: {
          workspaceId,
          userId: creatorId,
          action: 'TASK_CREATED',
          entityType: 'TASK',
          entityId: task.id,
          details: JSON.stringify({ title: task.title, status: task.status }),
        },
      });

      // If assigned to someone else, create notification
      if (data.assigneeId && data.assigneeId !== creatorId) {
        await tx.notification.create({
          data: {
            userId: data.assigneeId,
            type: 'TASK_ASSIGNED',
            title: 'New Task Assignment',
            message: `You have been assigned to "${task.title}".`,
            link: `/kanban`,
          },
        });
      }

      return task;
    });
  }

  async updateTaskStatus(
    taskId: string,
    workspaceId: string,
    userId: string,
    status: TaskStatus,
    orderIndex?: number
  ) {
    const existing = await prisma.task.findFirst({
      where: { id: taskId, workspaceId },
    });
    if (!existing) throw new NotFoundError('Task not found');

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: {
        status,
        ...(orderIndex !== undefined && { orderIndex }),
      },
    });

    if (existing.status !== status) {
      await prisma.activityLog.create({
        data: {
          workspaceId,
          userId,
          action: 'STATUS_CHANGED',
          entityType: 'TASK',
          entityId: taskId,
          details: JSON.stringify({
            fromStatus: existing.status,
            toStatus: status,
          }),
        },
      });
    }

    return updated;
  }

  async updateTask(
    taskId: string,
    workspaceId: string,
    userId: string,
    data: {
      title?: string;
      description?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      dueDate?: Date;
      assigneeId?: string | null;
      projectId?: string;
    }
  ) {
    const existing = await prisma.task.findFirst({
      where: { id: taskId, workspaceId },
    });
    if (!existing) throw new NotFoundError('Task not found');

    const updated = await prisma.task.update({
      where: { id: taskId },
      data,
    });

    await prisma.activityLog.create({
      data: {
        workspaceId,
        userId,
        action: 'TASK_UPDATED',
        entityType: 'TASK',
        entityId: taskId,
        details: JSON.stringify(data),
      },
    });

    return updated;
  }

  async deleteTask(taskId: string, workspaceId: string, userId: string) {
    const deleted = await prisma.task.delete({
      where: { id: taskId, workspaceId },
    });

    await prisma.activityLog.create({
      data: {
        workspaceId,
        userId,
        action: 'TASK_DELETED',
        entityType: 'TASK',
        entityId: taskId,
        details: JSON.stringify({ title: deleted.title }),
      },
    });

    return deleted;
  }
}

export const taskService = new TaskService();
