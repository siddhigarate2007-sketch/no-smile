import prisma from '../config/prisma.js';
import { hashPassword, comparePassword, generateSessionToken } from '../utils/security.js';
import { ConflictError, UnauthorizedError } from '../utils/errors.js';

const SESSION_DURATION_DAYS = 7;

export class AuthService {
  async register(params: {
    email: string;
    password: string;
    name: string;
    userAgent?: string;
    ipAddress?: string;
  }) {
    const existing = await prisma.user.findUnique({
      where: { email: params.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictError('A user with this email address already exists');
    }

    const passwordHash = await hashPassword(params.password);
    const token = generateSessionToken();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000);

    // Atomically create user, default workspace, membership and session
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: params.email.toLowerCase(),
          passwordHash,
          name: params.name,
        },
      });

      const workspace = await tx.workspace.create({
        data: {
          name: `${params.name}'s Workspace`,
          description: 'Personal projects and roadmap planning',
        },
      });

      const membership = await tx.membership.create({
        data: {
          userId: user.id,
          workspaceId: workspace.id,
          role: 'OWNER',
        },
      });

      const session = await tx.session.create({
        data: {
          token,
          userId: user.id,
          userAgent: params.userAgent,
          ipAddress: params.ipAddress,
          expiresAt,
        },
      });

      return { user, workspace, membership, session, token };
    });

    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        avatar: result.user.avatar,
        bio: result.user.bio,
        createdAt: result.user.createdAt,
      },
      workspaces: [
        {
          id: result.workspace.id,
          name: result.workspace.name,
          description: result.workspace.description,
          role: result.membership.role,
          createdAt: result.workspace.createdAt,
        },
      ],
      token: result.token,
      expiresAt,
    };
  }

  async login(params: {
    email: string;
    password: string;
    userAgent?: string;
    ipAddress?: string;
  }) {
    const user = await prisma.user.findUnique({
      where: { email: params.email.toLowerCase() },
      include: {
        memberships: {
          include: {
            workspace: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isValidPassword = await comparePassword(params.password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = generateSessionToken();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000);

    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        userAgent: params.userAgent,
        ipAddress: params.ipAddress,
        expiresAt,
      },
    });

    const workspaces = user.memberships.map((m) => ({
      id: m.workspace.id,
      name: m.workspace.name,
      description: m.workspace.description,
      role: m.role,
      createdAt: m.workspace.createdAt,
    }));

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt,
      },
      workspaces,
      token,
      expiresAt,
    };
  }

  async logout(token: string) {
    if (!token) return;
    try {
      await prisma.session.deleteMany({
        where: { token },
      });
    } catch {
      // Ignored if session already expired or removed
    }
  }

  async validateSession(token: string) {
    if (!token) return null;

    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          include: {
            memberships: {
              include: {
                workspace: true,
              },
            },
          },
        },
      },
    });

    if (!session) return null;

    if (new Date() > session.expiresAt) {
      await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
      return null;
    }

    const workspaces = session.user.memberships.map((m) => ({
      id: m.workspace.id,
      name: m.workspace.name,
      description: m.workspace.description,
      role: m.role,
      createdAt: m.workspace.createdAt,
    }));

    return {
      session,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        avatar: session.user.avatar,
        bio: session.user.bio,
        createdAt: session.user.createdAt,
      },
      workspaces,
    };
  }
}

export const authService = new AuthService();
