# DevFlow REST API Documentation

All API endpoints are prefixed with `/api/v1`.
Authentication is managed via HttpOnly secure session cookies.

## Endpoints Overview

### Authentication
- `POST /api/v1/auth/register` - Create a new user account + default personal workspace.
- `POST /api/v1/auth/login` - Authenticate with email/password and set HttpOnly session cookie.
- `POST /api/v1/auth/logout` - Invalidate session in DB and clear cookie.
- `GET /api/v1/auth/me` - Fetch authenticated user profile & active workspaces.

### Workspaces
- `GET /api/v1/workspaces` - List workspaces the user belongs to.
- `POST /api/v1/workspaces` - Create a new workspace.
- `GET /api/v1/workspaces/:workspaceId` - Get workspace details.
- `PATCH /api/v1/workspaces/:workspaceId` - Update workspace name/description.
- `DELETE /api/v1/workspaces/:workspaceId` - Delete workspace (Owner only).

### Projects
- `GET /api/v1/workspaces/:workspaceId/projects` - List projects (search, filter, pagination).
- `POST /api/v1/workspaces/:workspaceId/projects` - Create a project.
- `GET /api/v1/workspaces/:workspaceId/projects/:projectId` - Get project details + stats.
- `PATCH /api/v1/workspaces/:workspaceId/projects/:projectId` - Update project.
- `DELETE /api/v1/workspaces/:workspaceId/projects/:projectId` - Delete project.

### Tasks & Kanban
- `GET /api/v1/workspaces/:workspaceId/tasks` - List tasks with status, priority, search filters.
- `POST /api/v1/workspaces/:workspaceId/tasks` - Create task.
- `GET /api/v1/workspaces/:workspaceId/tasks/:taskId` - Get task details with comments & logs.
- `PATCH /api/v1/workspaces/:workspaceId/tasks/:taskId` - Update task (status, priority, assignee, etc.).
- `PATCH /api/v1/workspaces/:workspaceId/tasks/:taskId/status` - Quick status update for Kanban drag-and-drop.
- `DELETE /api/v1/workspaces/:workspaceId/tasks/:taskId` - Delete task.

### Team & Collaboration
- `GET /api/v1/workspaces/:workspaceId/members` - List workspace members.
- `POST /api/v1/workspaces/:workspaceId/invitations` - Create invitation token.
- `POST /api/v1/invitations/accept` - Accept workspace invitation.
- `PATCH /api/v1/workspaces/:workspaceId/members/:memberId` - Update member role.
- `DELETE /api/v1/workspaces/:workspaceId/members/:memberId` - Remove member.

### Comments & Activities
- `GET /api/v1/tasks/:taskId/comments` - List comments on task.
- `POST /api/v1/tasks/:taskId/comments` - Post comment on task.
- `GET /api/v1/workspaces/:workspaceId/activities` - Activity feed.

### Notifications & Analytics
- `GET /api/v1/notifications` - Get user notifications.
- `PATCH /api/v1/notifications/:id/read` - Mark notification as read.
- `PATCH /api/v1/notifications/read-all` - Mark all notifications read.
- `GET /api/v1/workspaces/:workspaceId/analytics` - Summary stats, charts data, velocity.
