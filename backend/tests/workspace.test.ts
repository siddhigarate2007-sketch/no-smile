import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Workspace & RBAC Security Tests', () => {
  it('GET /api/v1/workspaces should require authentication', async () => {
    const res = await request(app).get('/api/v1/workspaces');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/workspaces/ws-1/projects should block unauthenticated request', async () => {
    const res = await request(app).get('/api/v1/workspaces/ws-1/projects');
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/workspaces/ws-1/tasks should block unauthenticated request', async () => {
    const res = await request(app).get('/api/v1/workspaces/ws-1/tasks');
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/notifications should block unauthenticated request', async () => {
    const res = await request(app).get('/api/v1/notifications');
    expect(res.status).toBe(401);
  });
});
