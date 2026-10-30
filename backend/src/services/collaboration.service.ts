import prisma from '../config/prisma.js';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors.js';
import { WorkspaceRole } from '@prisma/client';
import crypto from 'crypto';

export class CollaborationService {
  // Members
  async listMembers(workspaceId: string) {
    const memberships = await prisma.membership.findMany({
      where: { workspaceId },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return memberships.map((m) => ({
      id: m.id,
      userId: m.user.id,
      name: m.user.name,
      email: m.user.email,
      avatar: m.user.avatar,
      role: m.role,
      joinedAt: m.createdAt,
    }));
  }

  async updateMemberRole(
    workspaceId: string,
    targetUserId: string,
    role: WorkspaceRole
  ) {
    return prisma.membership.update({
      where: {
        userId_workspaceId: { userId: targetUserId, workspaceId },
      },
      data: { role },
    });
  }

  async removeMember(workspaceId: string, targetUserId: string) {
    return prisma.membership.delete({
      where: {
        userId_workspaceId: { userId: targetUserId, workspaceId },
      },
    });
  }

  // Invitations
  async createInvitation(
    workspaceId: string,
    inviterId: string,
    email: string,
    role: WorkspaceRole = 'MEMBER'
  ) {
    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invitation = await prisma.invitation.create({
      data: {
        email: email.toLowerCase(),
        role,
        token,
        workspaceId,
        inviterId,
        expiresAt,
      },
      include: {
        workspace: { select: { name: true } },
      },
    });

    return {
      invitationId: invitation.id,
      email: invitation.email,
      role: invitation.role,
      token: invitation.token,
      workspaceName: invitation.workspace.name,
      expiresAt: invitation.expiresAt,
    };
  }

  async acceptInvitation(token: string, userId: string) {
    const invitation = await prisma.invitation.findUnique({
      where: { token },
    });

    if (!invitation) throw new NotFoundError('Invalid invitation token');
    if (invitation.accepted) throw new BadRequestError('Invitation has already been used');
    if (new Date() > invitation.expiresAt) throw new BadRequestError('Invitation has expired');

    return prisma.$transaction(async (tx) => {
      await tx.invitation.update({
        where: { id: invitation.id },
        data: { accepted: true },
      });

      const membership = await tx.membership.create({
        data: {
          userId,
          workspaceId: invitation.workspaceId,
          role: invitation.role,
        },
      });

      return membership;
    });
  }

  // Comments
  async listComments(taskId: string) {
    return prisma.comment.findMany({
      where: { taskId },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async addComment(taskId: string, userId: string, content: string) {
    return prisma.$transaction(async (tx) => {
      const task = await tx.task.findUnique({ where: { id: taskId } });
      if (!task) throw new NotFoundError('Task not found');

      const comment = await tx.comment.create({
        data: {
          taskId,
          userId,
          content,
        },
        include: {
          user: {
            select: { id: true, name: true, email: true, avatar: true },
          },
        },
      });

      // Activity log
      await tx.activityLog.create({
        data: {
          workspaceId: task.workspaceId,
          userId,
          action: 'COMMENT_ADDED',
          entityType: 'TASK',
          entityId: taskId,
          details: JSON.stringify({ commentId: comment.id }),
        },
      });

      // If task has assignee and not commenter, notify assignee
      if (task.assigneeId && task.assigneeId !== userId) {
        await tx.notification.create({
          data: {
            userId: task.assigneeId,
            type: 'TASK_COMMENT',
            title: 'New Comment on Task',
            message: `${comment.user.name} commented on "${task.title}".`,
            link: '/tasks',
          },
        });
      }

      return comment;
    });
  }

  // Activity feed
  async getActivityLogs(workspaceId: string, limit = 20) {
    return prisma.activityLog.findMany({
      where: { workspaceId },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  // Notifications
  async getUserNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
  }

  async markNotificationRead(id: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id, userId },
      data: { read: true },
    });
  }

  async markAllNotificationsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  // Analytics
  async getWorkspaceAnalytics(workspaceId: string) {
    const [
      totalProjects,
      activeProjects,
      totalTasks,
      completedTasks,
      inProgressTasks,
      inReviewTasks,
      todoTasks,
      overdueTasks,
      projects,
      recentActivities,
    ] = await Promise.all([
      prisma.project.count({ where: { workspaceId } }),
      prisma.project.count({ where: { workspaceId, status: 'ACTIVE' } }),
      prisma.task.count({ where: { workspaceId } }),
      prisma.task.count({ where: { workspaceId, status: 'COMPLETED' } }),
      prisma.task.count({ where: { workspaceId, status: 'IN_PROGRESS' } }),
      prisma.task.count({ where: { workspaceId, status: 'IN_REVIEW' } }),
      prisma.task.count({ where: { workspaceId, status: 'TODO' } }),
      prisma.task.count({
        where: {
          workspaceId,
          dueDate: { lt: new Date() },
          status: { not: 'COMPLETED' },
        },
      }),
      prisma.project.findMany({
        where: { workspaceId },
        take: 5,
        orderBy: { updatedAt: 'desc' },
        include: {
          tasks: { select: { status: true } },
        },
      }),
      prisma.activityLog.findMany({
        where: { workspaceId },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true, avatar: true } },
        },
      }),
    ]);

    const projectProgress = projects.map((p) => {
      const count = p.tasks.length;
      const completed = p.tasks.filter((t) => t.status === 'COMPLETED').length;
      return {
        id: p.id,
        name: p.name,
        progress: count > 0 ? Math.round((completed / count) * 100) : 0,
        tasksCount: count,
      };
    });

    const taskStatusDistribution = [
      { name: 'Completed', value: completedTasks, color: '#34C759' },
      { name: 'In Progress', value: inProgressTasks, color: '#007AFF' },
      { name: 'In Review', value: inReviewTasks, color: '#FF9F0A' },
      { name: 'To Do', value: todoTasks, color: '#86868B' },
    ];

    return {
      totalProjects,
      activeProjects,
      totalTasks,
      completedTasks,
      pendingTasks: inProgressTasks + inReviewTasks + todoTasks,
      overdueTasks,
      taskStatusDistribution,
      projectProgress,
      recentActivities,
    };
  }
}

export const collaborationService = new CollaborationService();
