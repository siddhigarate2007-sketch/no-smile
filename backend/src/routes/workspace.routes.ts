import { Router } from 'express';
import { workspaceController } from '../controllers/workspace.controller.js';
import { requireAuth, requireWorkspaceRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const createWorkspaceSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().optional(),
  }),
});

const updateWorkspaceSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
  }),
});

const router = Router();

router.use(requireAuth);

router.get('/', (req, res, next) => workspaceController.list(req, res, next));
router.post(
  '/',
  validate(createWorkspaceSchema),
  (req, res, next) => workspaceController.create(req, res, next)
);

router.get(
  '/:workspaceId',
  requireWorkspaceRole(['OWNER', 'ADMIN', 'MEMBER']),
  (req, res, next) => workspaceController.getById(req, res, next)
);

router.patch(
  '/:workspaceId',
  requireWorkspaceRole(['OWNER', 'ADMIN']),
  validate(updateWorkspaceSchema),
  (req, res, next) => workspaceController.update(req, res, next)
);

router.delete(
  '/:workspaceId',
  requireWorkspaceRole(['OWNER']),
  (req, res, next) => workspaceController.delete(req, res, next)
);

export default router;
