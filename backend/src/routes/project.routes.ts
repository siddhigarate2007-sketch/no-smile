import { Router } from 'express';
import { projectController } from '../controllers/project.controller.js';
import { requireAuth, requireWorkspaceRole } from '../middleware/auth.js';

const router = Router({ mergeParams: true });

router.use(requireAuth);

router.get(
  '/',
  requireWorkspaceRole(['OWNER', 'ADMIN', 'MEMBER']),
  (req, res, next) => projectController.list(req, res, next)
);

router.post(
  '/',
  requireWorkspaceRole(['OWNER', 'ADMIN']),
  (req, res, next) => projectController.create(req, res, next)
);

router.get(
  '/:projectId',
  requireWorkspaceRole(['OWNER', 'ADMIN', 'MEMBER']),
  (req, res, next) => projectController.getById(req, res, next)
);

router.patch(
  '/:projectId',
  requireWorkspaceRole(['OWNER', 'ADMIN']),
  (req, res, next) => projectController.update(req, res, next)
);

router.delete(
  '/:projectId',
  requireWorkspaceRole(['OWNER', 'ADMIN']),
  (req, res, next) => projectController.delete(req, res, next)
);

export default router;
