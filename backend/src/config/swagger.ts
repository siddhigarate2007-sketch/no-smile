export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'DevFlow API',
    version: '1.0.0',
    description:
      'Production RESTful API for DevFlow — The Apple-inspired Developer Productivity Platform',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local development server',
    },
  ],
  paths: {
    '/api/v1/health': {
      get: {
        summary: 'Service health check',
        responses: {
          '200': { description: 'Service operational' },
        },
      },
    },
    '/api/v1/auth/register': {
      post: {
        summary: 'Register new user account & workspace',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'name'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8 },
                  name: { type: 'string', minLength: 2 },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'User registered, session cookie set' },
          '400': { description: 'Validation error' },
          '409': { description: 'User already exists' },
        },
      },
    },
    '/api/v1/auth/login': {
      post: {
        summary: 'Log in with email & password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Authenticated successfully' },
          '401': { description: 'Invalid credentials' },
        },
      },
    },
    '/api/v1/auth/logout': {
      post: {
        summary: 'Log out current session',
        responses: {
          '200': { description: 'Logged out successfully' },
        },
      },
    },
    '/api/v1/auth/me': {
      get: {
        summary: 'Get authenticated user details and memberships',
        responses: {
          '200': { description: 'Authenticated user profile' },
          '401': { description: 'Unauthenticated' },
        },
      },
    },
    '/api/v1/workspaces': {
      get: {
        summary: 'List user workspaces',
        responses: {
          '200': { description: 'Array of workspaces' },
        },
      },
      post: {
        summary: 'Create a new workspace',
        responses: {
          '201': { description: 'Workspace created' },
        },
      },
    },
    '/api/v1/workspaces/{workspaceId}/projects': {
      get: {
        summary: 'List workspace projects',
        responses: {
          '200': { description: 'Array of projects' },
        },
      },
      post: {
        summary: 'Create a project',
        responses: {
          '201': { description: 'Project created' },
        },
      },
    },
    '/api/v1/workspaces/{workspaceId}/tasks': {
      get: {
        summary: 'List workspace tasks for Kanban/List',
        responses: {
          '200': { description: 'Array of tasks' },
        },
      },
      post: {
        summary: 'Create task',
        responses: {
          '201': { description: 'Task created' },
        },
      },
    },
    '/api/v1/workspaces/{workspaceId}/analytics': {
      get: {
        summary: 'Fetch workspace metrics & chart analytics',
        responses: {
          '200': { description: 'Productivity statistics' },
        },
      },
    },
  },
};
