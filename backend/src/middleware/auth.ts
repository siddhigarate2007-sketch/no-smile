import { type Request, type Response, type NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';
import { WorkspaceRole } from '@prisma/client';

const COOKIE_NAME = 'devflow_session';

// Extend Express Request types
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        avatar?: string | null;
        bio?: string | null;
        createdAt: Date;
      };
      session?: any;
      workspaces?: {
        id: string;
        name: string;
        description?: string | null;
        role: WorkspaceRole;
        createdAt: Date;
      }[];
    }
  }
}

export async function authenticateSession(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let token = req.cookies?.[COOKIE_NAME];

    // Fallback to Bearer token in Authorization header for API testing
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const sessionData = await authService.validateSession(token);
      if (sessionData) {
        req.user = sessionData.user;
        req.session = sessionData.session;
        req.workspaces = sessionData.workspaces;
      }
    }
    next();
  } catch (error) {
    next(error);
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) {
    return next(new UnauthorizedError('Authentication required to access this resource'));
  }
  next();
}

export function requireWorkspaceRole(allowedRoles: WorkspaceRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    const workspaceId =
      req.params.workspaceId ||
      (req.headers['x-workspace-id'] as string) ||
      (req.query.workspaceId as string);

    if (!workspaceId) {
      return next(new ForbiddenError('Workspace ID context is required'));
    }

    const membership = req.workspaces?.find((w) => w.id === workspaceId);
    if (!membership) {
      return next(new ForbiddenError('You are not a member of this workspace'));
    }

    if (!allowedRoles.includes(membership.role)) {
      return next(
        new ForbiddenError(
          `Insufficient permissions. Required role: ${allowedRoles.join(' or ')}`
        )
      );
    }

    next();
  };
}
