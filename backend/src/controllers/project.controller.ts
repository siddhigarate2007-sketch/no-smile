import { type Request, type Response, type NextFunction } from 'express';
import { projectService } from '../services/project.service.js';
import { UnauthorizedError } from '../utils/errors.js';
import { ProjectStatus, ProjectPriority } from '@prisma/client';

export class ProjectController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const workspaceId = req.params.workspaceId;
      const { status, priority, search, page, limit } = req.query;

      const result = await projectService.listProjects(workspaceId, {
        status: status as ProjectStatus,
        priority: priority as ProjectPriority,
        search: search as string,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20,
      });

      res.status(200).json({ success: true, data: result.projects, pagination: result.pagination });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId, projectId } = req.params;
      const project = await projectService.getProjectById(projectId, workspaceId);
      res.status(200).json({ success: true, data: project });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      const workspaceId = req.params.workspaceId;
      const { name, description, status, priority, startDate, deadline } = req.body;

      const project = await projectService.createProject(workspaceId, req.user.id, {
        name,
        description,
        status,
        priority,
        startDate: startDate ? new Date(startDate) : undefined,
        deadline: deadline ? new Date(deadline) : undefined,
      });

      res.status(201).json({ success: true, data: project });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      const { workspaceId, projectId } = req.params;
      const { name, description, status, priority, startDate, deadline } = req.body;

      const updated = await projectService.updateProject(
        projectId,
        workspaceId,
        req.user.id,
        {
          name,
          description,
          status,
          priority,
          startDate: startDate ? new Date(startDate) : undefined,
          deadline: deadline ? new Date(deadline) : undefined,
        }
      );

      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      const { workspaceId, projectId } = req.params;
      await projectService.deleteProject(projectId, workspaceId, req.user.id);
      res.status(200).json({ success: true, message: 'Project successfully deleted' });
    } catch (error) {
      next(error);
    }
  }
}

export const projectController = new ProjectController();
