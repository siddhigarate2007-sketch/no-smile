# DevFlow Database Schema Documentation

## 1. Overview

DevFlow uses a normalized PostgreSQL relational database schema managed through Prisma ORM. All entities use UUIDv4 identifiers, explicit foreign keys, indexes on critical access paths, and workspace-level containment.

## 2. Entity Relationship Summary

- **User**: Core account identity with hashed password, avatar, bio, and timestamps.
- **Session**: Stateful authentication sessions stored in DB, tied to user and client IP/agent with expiry.
- **Workspace**: Primary tenant container. All productivity assets belong to a workspace.
- **Membership**: Junction entity establishing a User's role (`OWNER`, `ADMIN`, `MEMBER`) in a Workspace.
- **Invitation**: Pending workspace invitations with cryptographically random tokens and expiration.
- **Project**: Work initiative within a workspace with status (`PLANNING`, `ACTIVE`, `ON_HOLD`, `COMPLETED`) and priority (`LOW`, `MEDIUM`, `HIGH`).
- **ProjectMember**: Explicit project-level assignment and permissions.
- **Task**: Unit of work scoped to a project and workspace, with status (`TODO`, `IN_PROGRESS`, `IN_REVIEW`, `COMPLETED`), priority (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), due dates, and assignee.
- **Comment**: Discussion messages tied to a Task.
- **ActivityLog**: Immutable audit trail of workspace events (e.g. task created, status changed, member invited).
- **Notification**: User-level notifications for task assignments, comments, deadlines, and mentions.

## 3. Indexes & Constraints

- `Session(token)`: Unique index for fast cookie lookup.
- `Membership(userId, workspaceId)`: Compound unique index.
- `Invitation(token)`: Unique index.
- `Task(workspaceId, status)`: Compound index for Kanban column loading.
- `Task(projectId)`: Foreign key index.
- `ActivityLog(workspaceId, createdAt)`: Compound index for activity feeds.
