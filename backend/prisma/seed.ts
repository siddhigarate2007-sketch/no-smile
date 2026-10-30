import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding DevFlow database...');

  // Clean existing records if any
  await prisma.comment.deleteMany().catch(() => {});
  await prisma.activityLog.deleteMany().catch(() => {});
  await prisma.notification.deleteMany().catch(() => {});
  await prisma.task.deleteMany().catch(() => {});
  await prisma.projectMember.deleteMany().catch(() => {});
  await prisma.project.deleteMany().catch(() => {});
  await prisma.membership.deleteMany().catch(() => {});
  await prisma.session.deleteMany().catch(() => {});
  await prisma.workspace.deleteMany().catch(() => {});
  await prisma.user.deleteMany().catch(() => {});

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Create primary users
  const alex = await prisma.user.create({
    data: {
      email: 'alex.rivera@devflow.io',
      name: 'Alex Rivera',
      passwordHash,
      bio: 'Staff Software Architect & Lead Engineer',
    },
  });

  const sarah = await prisma.user.create({
    data: {
      email: 'sarah.chen@devflow.io',
      name: 'Sarah Chen',
      passwordHash,
      bio: 'Senior Full-Stack Engineer & Design Systems Specialist',
    },
  });

  const marcus = await prisma.user.create({
    data: {
      email: 'marcus.brody@devflow.io',
      name: 'Marcus Brody',
      passwordHash,
      bio: 'DevOps & Cloud Security Specialist',
    },
  });

  // 2. Create primary workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: 'DevFlow Engineering',
      description: 'Core platform engineering, API services, and frontend applications',
    },
  });

  // 3. Create memberships
  await prisma.membership.createMany({
    data: [
      { userId: alex.id, workspaceId: workspace.id, role: 'OWNER' },
      { userId: sarah.id, workspaceId: workspace.id, role: 'ADMIN' },
      { userId: marcus.id, workspaceId: workspace.id, role: 'MEMBER' },
    ],
  });

  // 4. Create sample projects
  const cloudProj = await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      name: 'Cloud Infrastructure & High Availability',
      description: 'PostgreSQL failover, Docker compose clustering, and Redis session caching.',
      status: 'ACTIVE',
      priority: 'HIGH',
      startDate: new Date('2026-10-01'),
      deadline: new Date('2026-11-20'),
    },
  });

  const designProj = await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      name: 'Apple-Inspired Design System 2.0',
      description: 'Minimalist UI primitives, subtle shadows, and responsive touch gestures.',
      status: 'ACTIVE',
      priority: 'MEDIUM',
      startDate: new Date('2026-10-10'),
      deadline: new Date('2026-11-30'),
    },
  });

  // 5. Create sample tasks across 4 Kanban columns
  await prisma.task.createMany({
    data: [
      {
        workspaceId: workspace.id,
        projectId: cloudProj.id,
        creatorId: alex.id,
        assigneeId: alex.id,
        title: 'Configure Argon2id password hashing and session rotation',
        description: 'Ensure sessions are persisted to PostgreSQL with HttpOnly secure cookie flags.',
        status: 'IN_PROGRESS',
        priority: 'URGENT',
        dueDate: new Date('2026-11-02'),
        orderIndex: 0,
      },
      {
        workspaceId: workspace.id,
        projectId: designProj.id,
        creatorId: alex.id,
        assigneeId: sarah.id,
        title: 'Refactor typography to SF Pro and Inter font stack',
        description: 'Match Apple optical weights and subtle text contrast cleanly.',
        status: 'COMPLETED',
        priority: 'MEDIUM',
        dueDate: new Date('2026-10-28'),
        orderIndex: 0,
      },
      {
        workspaceId: workspace.id,
        projectId: cloudProj.id,
        creatorId: alex.id,
        assigneeId: marcus.id,
        title: 'Configure Docker compose health checks and restart policies',
        description: 'Containerized local workflow with volume mounts.',
        status: 'IN_REVIEW',
        priority: 'HIGH',
        dueDate: new Date('2026-11-05'),
        orderIndex: 0,
      },
      {
        workspaceId: workspace.id,
        projectId: designProj.id,
        creatorId: alex.id,
        assigneeId: sarah.id,
        title: 'Implement dnd-kit collision detection for Kanban board',
        description: 'Support keyboard navigation and pointer collision sensors with smooth drag animations.',
        status: 'TODO',
        priority: 'HIGH',
        dueDate: new Date('2026-11-08'),
        orderIndex: 0,
      },
    ],
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
