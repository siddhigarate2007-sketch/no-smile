import { type Request, type Response, type NextFunction } from 'express';
import { taskService } from '../services/task.service.js';
import { UnauthorizedError } from '../utils/errors.js';
import { TaskStatus, TaskPriority } from '@prisma/client';

export class TaskController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const workspaceId = req.params.workspaceId;
      const { projectId, status, priority, assigneeId, search } = req.query;

      const tasks = await taskService.listTasks(workspaceId, {
        projectId: projectId as string,
        status: status as TaskStatus,
        priority: priority as TaskPriority,
        assigneeId: assigneeId as string,
        search: search as string,
      });

      res.status(200).json({ success: true, data: tasks });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId, taskId } = req.params;
      const task = await taskService.getTaskById(taskId, workspaceId);
      res.status(200).json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      const workspaceId = req.params.workspaceId;
      const { title, description, status, priority, dueDate, projectId, assigneeId } = req.body;

      const task = await taskService.createTask(workspaceId, req.user.id, {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        projectId,
        assigneeId,
      });

      res.status(201).json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      const { workspaceId, taskId } = req.params;
      const { status, orderIndex } = req.body;

      const updated = await taskService.updateTaskStatus(
        taskId,
        workspaceId,
        req.user.id,
        status as TaskStatus,
        orderIndex
      );

      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      const { workspaceId, taskId } = req.params;
      const { title, description, status, priority, dueDate, assigneeId, projectId } = req.body;

      const updated = await taskService.updateTask(taskId, workspaceId, req.user.id, {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        assigneeId,
        projectId,
      });

      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError();
      const { workspaceId, taskId } = req.params;
      await taskService.deleteTask(taskId, workspaceId, req.user.id);
      res.status(200).json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const taskController = new TaskController();
