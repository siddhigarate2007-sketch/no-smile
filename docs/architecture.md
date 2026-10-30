# DevFlow Architecture Document

## 1. System Overview

DevFlow is a full-stack developer productivity platform engineered with an Apple-inspired minimalist design philosophy. The architecture prioritizes clean separation of concerns, workspace isolation, type safety end-to-end, and sub-100ms UI interactions.

## 2. Technology Stack & Architectural Decisions

### Frontend
- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS with custom Apple design tokens (`#F5F5F7` canvas, `#FFFFFF` cards, `#1D1D1F` typography, `#86868B` subtle text, `#007AFF` accent)
- **Component Primitives:** Headless accessible UI patterns inspired by shadcn/ui
- **Icons:** Lucide React
- **Client & Server State:** React Router DOM v6 + TanStack Query v5 (automatic caching, background refetching, optimistic updates)
- **Forms & Validation:** React Hook Form + Zod
- **Data Visualizations:** Recharts for productivity charts, completion distributions, velocity graphs
- **Drag & Drop:** `@dnd-kit/core` & `@dnd-kit/sortable` for the 4-column interactive Kanban board

### Backend
- **Runtime:** Node.js (v26 LTS compatible) + Express.js
- **Language:** TypeScript with strict type checking
- **Architecture:** Layered Architecture:
  `Routes -> Middleware -> Controllers -> Services -> Data Access (Prisma ORM) -> PostgreSQL`
- **Security:** Helmet, CORS with explicit origin, Rate limiting, Argon2id/bcrypt password hashing, HttpOnly secure cookie-based session management
- **Validation:** Zod request parsing on body, params, and queries
- **Error Handling:** Centralized `AppError` and global error-handling middleware

### Database & Persistence
- **RDBMS:** PostgreSQL 16
- **ORM:** Prisma ORM
- **Key Characteristics:** UUID primary keys, normalized relationships, workspace-level tenant isolation, audit trails (`ActivityLog`), session persistence

## 3. Directory Layout

```
devflow/
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── ui/
│       │   ├── layout/
│       │   └── features/
│       ├── pages/
│       ├── hooks/
│       ├── services/
│       ├── types/
│       ├── schemas/
│       ├── utils/
│       └── main.tsx
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── utils/
│   │   └── server.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── tests/
├── docs/
├── docker-compose.yml
├── .env.example
├── .gitignore
├── README.md
└── package.json
```

## 4. Multi-Tenant Workspace Isolation

Every project, task, comment, invitation, and activity log is scoped to a `workspaceId`. Backend authorization middleware inspects user memberships and roles (`OWNER`, `ADMIN`, `MEMBER`) to prevent cross-workspace data leakage.
