# DevFlow — Full-Stack Developer Productivity Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4-2D3748.svg)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)
[![Vitest](https://img.shields.io/badge/Vitest-3.0-FCC72B.svg)](https://vitest.dev/)

DevFlow is an Apple-inspired minimalist productivity platform built for developers, engineering teams, and technical organizations to manage complex projects, organize tasks with high-performance drag-and-drop Kanban boards, monitor analytics, and collaborate with role-based access control.

---

## 1. Design Direction: Apple-Inspired Minimalism

DevFlow follows a disciplined design aesthetic prioritizing clarity, typography, subtle depth, and intentional spacing:

- **Primary Background:** `#F5F5F7`
- **Card Surfaces:** `#FFFFFF`
- **Typography:** `#1D1D1F` (primary), `#86868B` (secondary)
- **Primary Accent:** `#007AFF`
- **Dividers & Borders:** `#E5E5EA`
- **Semantic Statuses:** Success (`#34C759`), Warning (`#FF9F0A`), Danger (`#FF3B30`)
- **Visual Polish:** Soft multi-layered shadows (`box-shadow: 0 4px 20px rgba(0,0,0,0.06)`), 14px rounded cards, subtle transitions, and clutter-free responsive layouts.

---

## 2. Technology Stack

### Frontend
- **Framework:** React 18 with TypeScript and Vite
- **Styling:** Tailwind CSS + custom Apple-inspired design tokens
- **Icons:** Lucide React
- **Routing:** React Router v6
- **Server State:** TanStack Query v5 (automatic caching, background revalidation)
- **Forms & Validation:** React Hook Form + Zod
- **Visualizations:** Recharts (Productivity trends, task status distribution, project velocity)
- **Drag & Drop:** `@dnd-kit/core` and `@dnd-kit/sortable`
- **Testing:** Vitest + React Testing Library + jsdom

### Backend
- **Runtime:** Node.js (v26 LTS compatible) + Express.js + TypeScript
- **Validation:** Zod request parsing for queries, params, and payloads
- **Security:** Helmet, CORS with explicit origin, HttpOnly cookie-based sessions, Argon2/bcrypt password hashing, rate limiting
- **Error Handling:** Centralized `AppError` and structured JSON error responses
- **Architecture:** Layered Controller-Service-Repository pattern
- **Testing:** Vitest + Supertest

### Database & ORM
- **Database:** PostgreSQL 16
- **ORM:** Prisma ORM
- **Features:** UUID primary keys, normalized schema, indexes on high-frequency query paths, workspace-level tenant isolation, audit activity logs

---

## 3. Project Structure

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
│   ├── architecture.md
│   ├── database-schema.md
│   └── api-documentation.md
├── docker-compose.yml
├── .env.example
├── .gitignore
├── README.md
└── package.json
```

---

## 4. Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ (tested on v26 LTS)
- [npm](https://www.npmjs.com/) v10+
- [Docker Desktop](https://www.docker.com/) OR a local/cloud PostgreSQL instance (e.g., Neon, Supabase)

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/your-username/devflow.git
cd devflow

# Install root orchestrator dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Configure Environment Variables
Copy `.env.example` in both root and `backend/`:
```bash
cp .env.example backend/.env
```
Ensure `DATABASE_URL` matches your PostgreSQL connection string.

### 3. Start Database (Optional Docker)
```bash
docker compose up -d
```

### 4. Run Prisma Migrations & Generate Client
```bash
cd backend
npx prisma generate
npx prisma db push
```

### 5. Launch Development Servers
Run both backend and frontend concurrently from the root:
```bash
npm run dev
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- Health check: `http://localhost:5000/api/v1/health`

---

## 5. Testing

DevFlow includes end-to-end unit, integration, and API tests:
```bash
# Run all tests across frontend and backend
npm run test

# Run backend API tests only
npm run test:backend

# Run frontend component tests only
npm run test:frontend
```

---

## 6. Deployment Guide

- **Frontend:** Deployed to Vercel with zero-configuration Vite preset.
- **Backend:** Deployed to Render, Railway, or Fly.io with `node dist/server.js`.
- **Database:** Managed PostgreSQL instance via Neon, Supabase, or AWS RDS.
