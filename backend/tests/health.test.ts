import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Health Check API', () => {
  it('GET /api/v1/health should return 200 with status ok', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('devflow-backend');
    expect(res.body.timestamp).toBeDefined();
  });

  it('GET /api/docs should serve Swagger UI documentation', async () => {
    const res = await request(app).get('/api/docs/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('swagger');
  });

  it('GET /api/v1/unknown-route should return 404', async () => {
    const res = await request(app).get('/api/v1/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
