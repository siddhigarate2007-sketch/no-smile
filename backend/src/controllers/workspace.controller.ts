import { type Request, type Response, type NextFunction } from 'express';
import { workspaceService } from '../services/workspace.service.js';
import { UnauthorizedError } from '../utils/errors.js';

export class WorkspaceController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      const workspaces = await workspaceService.listUserWorkspaces(req.user.id);
      res.status(200).json({ success: true, data: workspaces });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      const workspace = await workspaceService.getWorkspaceById(
        req.params.workspaceId,
        req.user.id
      );
      res.status(200).json({ success: true, data: workspace });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      const { name, description } = req.body;
      const workspace = await workspaceService.createWorkspace(
        req.user.id,
        name,
        description
      );
      res.status(201).json({ success: true, data: workspace });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description } = req.body;
      const updated = await workspaceService.updateWorkspace(
        req.params.workspaceId,
        { name, description }
      );
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await workspaceService.deleteWorkspace(req.params.workspaceId);
      res.status(200).json({
        success: true,
        message: 'Workspace successfully deleted',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const workspaceController = new WorkspaceController();
