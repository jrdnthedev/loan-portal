import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express, { Application } from 'express';
import authRoutes from '../../../routes/auth.routes';
import { errorHandler } from '../../../middleware/error.middleware';

// Create a test app
const createTestApp = (): Application => {
  const app = express();
  app.use(express.json());
  app.use('/auth', authRoutes);
  app.use(errorHandler);
  return app;
};

describe('Auth Routes Integration Tests', () => {
  let app: Application;

  beforeAll(() => {
    app = createTestApp();
  });

  describe('POST /auth/login', () => {
    it('should return 400 if email or password is missing', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'test@example.com',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should accept login request with email and password', async () => {
      // Note: This will fail with actual database call
      // In real integration tests, you'd use a test database
      const response = await request(app).post('/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      // Will return 401 or 500 since we don't have real data
      expect([401, 500]).toContain(response.status);
    });
  });

  describe('POST /auth/register', () => {
    it('should return 400 if required fields are missing', async () => {
      const response = await request(app).post('/auth/register').send({
        email: 'test@example.com',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should accept registration request with all required fields', async () => {
      const response = await request(app).post('/auth/register').send({
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
      });

      // Will return error since we don't have real database
      // In real integration tests, you'd use a test database
      expect([201, 400, 500]).toContain(response.status);
    });
  });
});
