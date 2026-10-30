import prisma from '../config/prisma.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';
import { WorkspaceRole } from '@prisma/client';

export class WorkspaceService {
  async listUserWorkspaces(userId: string) {
    const memberships = await prisma.membership.findMany({
      where: { userId },
      include: {
        workspace: {
          include: {
            _count: {
              select: {
                memberships: true,
                projects: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return memberships.map((m) => ({
      id: m.workspace.id,
      name: m.workspace.name,
      description: m.workspace.description,
      role: m.role,
      memberCount: m.workspace._count.memberships,
      projectCount: m.workspace._count.projects,
      createdAt: m.workspace.createdAt,
    }));
  }

  async getWorkspaceById(workspaceId: string, userId: string) {
    const membership = await prisma.membership.findUnique({
      where: {
        userId_workspaceId: { userId, workspaceId },
      },
      include: {
        workspace: {
          include: {
            _count: {
              select: {
                memberships: true,
                projects: true,
                tasks: true,
              },
            },
          },
        },
      },
    });

    if (!membership) {
      throw new NotFoundError('Workspace not found or access denied');
    }

    return {
      id: membership.workspace.id,
      name: membership.workspace.name,
      description: membership.workspace.description,
      role: membership.role,
      stats: {
        members: membership.workspace._count.memberships,
        projects: membership.workspace._count.projects,
        tasks: membership.workspace._count.tasks,
      },
      createdAt: membership.workspace.createdAt,
    };
  }

  async createWorkspace(userId: string, name: string, description?: string) {
    return prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: {
          name,
          description,
        },
      });

      const membership = await tx.membership.create({
        data: {
          userId,
          workspaceId: workspace.id,
          role: 'OWNER',
        },
      });

      return {
        id: workspace.id,
        name: workspace.name,
        description: workspace.description,
        role: membership.role,
        memberCount: 1,
        projectCount: 0,
        createdAt: workspace.createdAt,
      };
    });
  }

  async updateWorkspace(
    workspaceId: string,
    data: { name?: string; description?: string }
  ) {
    return prisma.workspace.update({
      where: { id: workspaceId },
      data,
    });
  }

  async deleteWorkspace(workspaceId: string) {
    return prisma.workspace.delete({
      where: { id: workspaceId },
    });
  }
}

export const workspaceService = new WorkspaceService();
