import { Router } from 'express';
import { taskController } from '../controllers/task.controller.js';
import { requireAuth, requireWorkspaceRole } from '../middleware/auth.js';

const router = Router({ mergeParams: true });

router.use(requireAuth);

router.get(
  '/',
  requireWorkspaceRole(['OWNER', 'ADMIN', 'MEMBER']),
  (req, res, next) => taskController.list(req, res, next)
);

router.post(
  '/',
  requireWorkspaceRole(['OWNER', 'ADMIN', 'MEMBER']),
  (req, res, next) => taskController.create(req, res, next)
);

router.get(
  '/:taskId',
  requireWorkspaceRole(['OWNER', 'ADMIN', 'MEMBER']),
  (req, res, next) => taskController.getById(req, res, next)
);

router.patch(
  '/:taskId',
  requireWorkspaceRole(['OWNER', 'ADMIN', 'MEMBER']),
  (req, res, next) => taskController.update(req, res, next)
);

router.patch(
  '/:taskId/status',
  requireWorkspaceRole(['OWNER', 'ADMIN', 'MEMBER']),
  (req, res, next) => taskController.updateStatus(req, res, next)
);

router.delete(
  '/:taskId',
  requireWorkspaceRole(['OWNER', 'ADMIN']),
  (req, res, next) => taskController.delete(req, res, next)
);

export default router;
