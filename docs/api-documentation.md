# DevFlow REST API Documentation

Base URI: `/api/v1`  
Interactive Swagger UI: `http://localhost:5000/api/docs`

---

## 1. Authentication Endpoints

### `POST /api/v1/auth/register`
Creates user, personal workspace, and sets HttpOnly session cookie.
```json
// Request
{
  "name": "Alex Rivera",
  "email": "alex@devflow.io",
  "password": "Password123!"
}

// Response (201 Created)
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "c1f7a2d4-...",
      "email": "alex@devflow.io",
      "name": "Alex Rivera"
    },
    "workspaces": [
      {
        "id": "e3a8b1c9-...",
        "name": "Alex Rivera's Workspace",
        "role": "OWNER"
      }
    ]
  }
}
```

### `POST /api/v1/auth/login`
Authenticates user, creates session record, and issues cookie.
```json
// Request
{
  "email": "alex@devflow.io",
  "password": "Password123!"
}

// Response (200 OK)
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "workspaces": [ ... ]
  }
}
```

### `POST /api/v1/auth/logout`
Deletes session from database and clears cookie.

### `GET /api/v1/auth/me`
Returns current authenticated user profile and workspaces.

---

## 2. Workspace Endpoints

- `GET /api/v1/workspaces`: List workspaces for authenticated user.
- `POST /api/v1/workspaces`: Create workspace (`{ "name": "...", "description": "..." }`).
- `GET /api/v1/workspaces/:workspaceId`: Workspace details and stats.
- `PATCH /api/v1/workspaces/:workspaceId`: Update workspace metadata.
- `DELETE /api/v1/workspaces/:workspaceId`: Delete workspace (Owner only).

---

## 3. Project Endpoints

- `GET /api/v1/workspaces/:workspaceId/projects`: List projects with status and search filters.
- `POST /api/v1/workspaces/:workspaceId/projects`: Create project.
- `GET /api/v1/workspaces/:workspaceId/projects/:projectId`: Project details with task counts.
- `PATCH /api/v1/workspaces/:workspaceId/projects/:projectId`: Update project.
- `DELETE /api/v1/workspaces/:workspaceId/projects/:projectId`: Delete project.

---

## 4. Task & Kanban Endpoints

- `GET /api/v1/workspaces/:workspaceId/tasks`: List tasks by status/priority.
- `POST /api/v1/workspaces/:workspaceId/tasks`: Create task.
- `PATCH /api/v1/workspaces/:workspaceId/tasks/:taskId/status`: Quick drag-and-drop column move (`{ "status": "IN_PROGRESS", "orderIndex": 1 }`).
- `PATCH /api/v1/workspaces/:workspaceId/tasks/:taskId`: Full task update.
- `DELETE /api/v1/workspaces/:workspaceId/tasks/:taskId`: Delete task.

---

## 5. Team & Collaboration Endpoints

- `GET /api/v1/workspaces/:workspaceId/members`: List workspace engineers and roles.
- `POST /api/v1/workspaces/:workspaceId/invitations`: Generate secure 7-day invitation token.
- `POST /api/v1/invitations/accept`: Accept invitation token.
- `PATCH /api/v1/workspaces/:workspaceId/members/:memberId`: Update member role (Owner only).
- `DELETE /api/v1/workspaces/:workspaceId/members/:memberId`: Remove member from workspace.
- `GET /api/v1/tasks/:taskId/comments`: List comments for a task.
- `POST /api/v1/tasks/:taskId/comments`: Post comment on task.
- `GET /api/v1/workspaces/:workspaceId/activities`: Audit trail of workspace events.
- `GET /api/v1/workspaces/:workspaceId/analytics`: Database-backed metrics, status breakdown, weekly trend.
- `GET /api/v1/notifications`: List user notifications.
- `PATCH /api/v1/notifications/:id/read`: Mark notification read.
- `PATCH /api/v1/notifications/read-all`: Mark all read.
