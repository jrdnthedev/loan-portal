import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import express, { Application } from 'express';
import loanRoutes from '../../../routes/loan.routes';
import { errorHandler } from '../../../middleware/error.middleware';
import { authenticate } from '../../../middleware/auth.middleware';

// Create a test app
const createTestApp = (): Application => {
  const app = express();
  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'API is running' });
  });

  app.use('/loans', loanRoutes);
  app.use(errorHandler);
  return app;
};

describe('Loan Routes Integration Tests', () => {
  let app: Application;

  beforeAll(() => {
    app = createTestApp();
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'OK',
        message: 'API is running',
      });
    });
  });

  describe('GET /loans', () => {
    it('should return 401 when accessing protected route without token', async () => {
      const response = await request(app).get('/loans');

      expect(response.status).toBe(401);
    });

    it('should accept request with authorization header', async () => {
      const response = await request(app).get('/loans').set('Authorization', 'Bearer fake-token');

      // Will fail auth validation, but shows route is protected
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /loans/:id', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/loans/loan-123');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /loans', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app).post('/loans').send({
        type: 'personal',
        amount: 10000,
        termMonths: 36,
      });

      expect(response.status).toBe(401);
    });
  });
});
