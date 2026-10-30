import prisma from '../config/prisma.js';
import { NotFoundError } from '../utils/errors.js';
import { ProjectStatus, ProjectPriority } from '@prisma/client';

export class ProjectService {
  async listProjects(
    workspaceId: string,
    filters?: {
      status?: ProjectStatus;
      priority?: ProjectPriority;
      search?: string;
      page?: number;
      limit?: number;
    }
  ) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { workspaceId };

    if (filters?.status) where.status = filters.status;
    if (filters?.priority) where.priority = filters.priority;
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              tasks: true,
              members: true,
            },
          },
          tasks: {
            select: {
              status: true,
            },
          },
        },
      }),
      prisma.project.count({ where }),
    ]);

    const formatted = projects.map((p) => {
      const totalTasks = p.tasks.length;
      const completedTasks = p.tasks.filter((t) => t.status === 'COMPLETED').length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        id: p.id,
        name: p.name,
        description: p.description,
        status: p.status,
        priority: p.priority,
        startDate: p.startDate,
        deadline: p.deadline,
        workspaceId: p.workspaceId,
        taskCount: totalTasks,
        completedTaskCount: completedTasks,
        progress,
        memberCount: p._count.members,
        createdAt: p.createdAt,
      };
    });

    return {
      projects: formatted,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProjectById(projectId: string, workspaceId: string) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, workspaceId },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
        },
        tasks: {
          include: {
            assignee: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!project) throw new NotFoundError('Project not found');

    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter((t) => t.status === 'COMPLETED').length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      ...project,
      taskCount: totalTasks,
      completedTaskCount: completedTasks,
      progress,
    };
  }

  async createProject(
    workspaceId: string,
    userId: string,
    data: {
      name: string;
      description?: string;
      status?: ProjectStatus;
      priority?: ProjectPriority;
      startDate?: Date;
      deadline?: Date;
    }
  ) {
    return prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          workspaceId,
          name: data.name,
          description: data.description,
          status: data.status || 'PLANNING',
          priority: data.priority || 'MEDIUM',
          startDate: data.startDate,
          deadline: data.deadline,
        },
      });

      // Automatically add creator as a project member
      await tx.projectMember.create({
        data: {
          projectId: project.id,
          userId,
        },
      });

      // Audit log
      await tx.activityLog.create({
        data: {
          workspaceId,
          userId,
          action: 'PROJECT_CREATED',
          entityType: 'PROJECT',
          entityId: project.id,
          details: JSON.stringify({ name: project.name }),
        },
      });

      return project;
    });
  }

  async updateProject(
    projectId: string,
    workspaceId: string,
    userId: string,
    data: {
      name?: string;
      description?: string;
      status?: ProjectStatus;
      priority?: ProjectPriority;
      startDate?: Date;
      deadline?: Date;
    }
  ) {
    const updated = await prisma.project.update({
      where: { id: projectId, workspaceId },
      data,
    });

    await prisma.activityLog.create({
      data: {
        workspaceId,
        userId,
        action: 'PROJECT_UPDATED',
        entityType: 'PROJECT',
        entityId: projectId,
        details: JSON.stringify(data),
      },
    });

    return updated;
  }

  async deleteProject(projectId: string, workspaceId: string, userId: string) {
    const deleted = await prisma.project.delete({
      where: { id: projectId, workspaceId },
    });

    await prisma.activityLog.create({
      data: {
        workspaceId,
        userId,
        action: 'PROJECT_DELETED',
        entityType: 'PROJECT',
        entityId: projectId,
        details: JSON.stringify({ name: deleted.name }),
      },
    });

    return deleted;
  }
}

export const projectService = new ProjectService();
