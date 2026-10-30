import { Router } from 'express';
import { collaborationController } from '../controllers/collaboration.controller.js';
import { requireAuth, requireWorkspaceRole } from '../middleware/auth.js';

const router = Router();

// Workspace Members
router.get(
  '/workspaces/:workspaceId/members',
  requireAuth,
  requireWorkspaceRole(['OWNER', 'ADMIN', 'MEMBER']),
  (req, res, next) => collaborationController.listMembers(req, res, next)
);

router.patch(
  '/workspaces/:workspaceId/members/:memberId',
  requireAuth,
  requireWorkspaceRole(['OWNER']),
  (req, res, next) => collaborationController.updateRole(req, res, next)
);

router.delete(
  '/workspaces/:workspaceId/members/:memberId',
  requireAuth,
  requireWorkspaceRole(['OWNER', 'ADMIN']),
  (req, res, next) => collaborationController.removeMember(req, res, next)
);

// Invitations
router.post(
  '/workspaces/:workspaceId/invitations',
  requireAuth,
  requireWorkspaceRole(['OWNER', 'ADMIN']),
  (req, res, next) => collaborationController.invite(req, res, next)
);

router.post('/invitations/accept', requireAuth, (req, res, next) =>
  collaborationController.acceptInvite(req, res, next)
);

// Task Comments
router.get('/tasks/:taskId/comments', requireAuth, (req, res, next) =>
  collaborationController.listComments(req, res, next)
);

router.post('/tasks/:taskId/comments', requireAuth, (req, res, next) =>
  collaborationController.addComment(req, res, next)
);

// Activities
router.get(
  '/workspaces/:workspaceId/activities',
  requireAuth,
  requireWorkspaceRole(['OWNER', 'ADMIN', 'MEMBER']),
  (req, res, next) => collaborationController.listActivities(req, res, next)
);

// Analytics
router.get(
  '/workspaces/:workspaceId/analytics',
  requireAuth,
  requireWorkspaceRole(['OWNER', 'ADMIN', 'MEMBER']),
  (req, res, next) => collaborationController.getAnalytics(req, res, next)
);

// Notifications
router.get('/notifications', requireAuth, (req, res, next) =>
  collaborationController.listNotifications(req, res, next)
);

router.patch('/notifications/read-all', requireAuth, (req, res, next) =>
  collaborationController.markAllRead(req, res, next)
);

router.patch('/notifications/:id/read', requireAuth, (req, res, next) =>
  collaborationController.markRead(req, res, next)
);

export default router;
