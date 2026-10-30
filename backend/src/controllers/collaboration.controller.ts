import { type Request, type Response, type NextFunction } from 'express';
import { collaborationService } from '../services/collaboration.service.js';
import { UnauthorizedError } from '../utils/errors.js';
import { WorkspaceRole } from '@prisma/client';

export class CollaborationController {
  // Members
  async listMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const workspaceId = req.params.workspaceId;
      const members = await collaborationService.listMembers(workspaceId);
      res.status(200).json({ success: true, data: members });
    } catch (error) {
      next(error);
    }
  }

  async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId, memberId } = req.params;
      const { role } = req.body;
      const updated = await collaborationService.updateMemberRole(
        workspaceId,
        memberId,
        role as WorkspaceRole
      );
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  async removeMember(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId, memberId } = req.params;
      await collaborationService.removeMember(workspaceId, memberId);
      res.status(200).json({ success: true, message: 'Member removed successfully' });
    } catch (error) {
      next(error);
    }
  }

  // Invitations
  async invite(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      const workspaceId = req.params.workspaceId;
      const { email, role } = req.body;

      const invitation = await collaborationService.createInvitation(
        workspaceId,
        req.user.id,
        email,
        role as WorkspaceRole
      );

      res.status(201).json({ success: true, data: invitation });
    } catch (error) {
      next(error);
    }
  }

  async acceptInvite(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      const { token } = req.body;
      const result = await collaborationService.acceptInvitation(token, req.user.id);
      res.status(200).json({
        success: true,
        message: 'Workspace invitation accepted successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Comments
  async listComments(req: Request, res: Response, next: NextFunction) {
    try {
      const taskId = req.params.taskId;
      const comments = await collaborationService.listComments(taskId);
      res.status(200).json({ success: true, data: comments });
    } catch (error) {
      next(error);
    }
  }

  async addComment(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      const taskId = req.params.taskId;
      const { content } = req.body;
      const comment = await collaborationService.addComment(
        taskId,
        req.user.id,
        content
      );
      res.status(201).json({ success: true, data: comment });
    } catch (error) {
      next(error);
    }
  }

  // Activities
  async listActivities(req: Request, res: Response, next: NextFunction) {
    try {
      const workspaceId = req.params.workspaceId;
      const activities = await collaborationService.getActivityLogs(workspaceId);
      res.status(200).json({ success: true, data: activities });
    } catch (error) {
      next(error);
    }
  }

  // Notifications
  async listNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      const notifications = await collaborationService.getUserNotifications(
        req.user.id
      );
      res.status(200).json({ success: true, data: notifications });
    } catch (error) {
      next(error);
    }
  }

  async markRead(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      const id = req.params.id;
      await collaborationService.markNotificationRead(id, req.user.id);
      res.status(200).json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
      next(error);
    }
  }

  async markAllRead(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      await collaborationService.markAllNotificationsRead(req.user.id);
      res.status(200).json({
        success: true,
        message: 'All notifications marked as read',
      });
    } catch (error) {
      next(error);
    }
  }

  // Analytics
  async getAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const workspaceId = req.params.workspaceId;
      const analytics = await collaborationService.getWorkspaceAnalytics(
        workspaceId
      );
      res.status(200).json({ success: true, data: analytics });
    } catch (error) {
      next(error);
    }
  }
}

export const collaborationController = new CollaborationController();
