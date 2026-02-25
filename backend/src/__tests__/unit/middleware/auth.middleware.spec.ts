import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate, authorize, AuthRequest } from '../../../middleware/auth.middleware';
import { mockRequest, mockResponse } from '../../helpers/mock-data';

// Mock jsonwebtoken
vi.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  describe('authenticate', () => {
    it('should return 401 if no token provided', () => {
      const req = mockRequest({ headers: {} }) as AuthRequest;
      const res = mockResponse() as Response;
      const next = vi.fn() as NextFunction;

      authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Authentication required' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if authorization header is malformed', () => {
      const req = mockRequest({
        headers: { authorization: 'InvalidFormat' },
      }) as AuthRequest;
      const res = mockResponse() as Response;
      const next = vi.fn() as NextFunction;

      vi.mocked(jwt.verify).mockImplementation(() => {
        throw new Error('jwt malformed');
      });

      authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', () => {
      const req = mockRequest({
        headers: { authorization: 'Bearer invalid-token' },
      }) as AuthRequest;
      const res = mockResponse() as Response;
      const next = vi.fn() as NextFunction;

      vi.mocked(jwt.verify).mockImplementation(() => {
        throw new Error('invalid token');
      });

      authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token is expired', () => {
      const req = mockRequest({
        headers: { authorization: 'Bearer expired-token' },
      }) as AuthRequest;
      const res = mockResponse() as Response;
      const next = vi.fn() as NextFunction;

      vi.mocked(jwt.verify).mockImplementation(() => {
        throw new Error('jwt expired');
      });

      authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should set user on request and call next if token is valid', () => {
      const decodedToken = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'customer',
      };

      const req = mockRequest({
        headers: { authorization: 'Bearer valid-token' },
      }) as AuthRequest;
      const res = mockResponse() as Response;
      const next = vi.fn() as NextFunction;

      vi.mocked(jwt.verify).mockReturnValue(decodedToken as any);

      authenticate(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.JWT_SECRET);
      expect(req.user).toEqual(decodedToken);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should handle Bearer token with extra spaces', () => {
      const decodedToken = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'customer',
      };

      const req = mockRequest({
        headers: { authorization: 'Bearer  valid-token' },
      }) as AuthRequest;
      const res = mockResponse() as Response;
      const next = vi.fn() as NextFunction;

      vi.mocked(jwt.verify).mockReturnValue(decodedToken as any);

      authenticate(req, res, next);

      expect(req.user).toEqual(decodedToken);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('authorize', () => {
    it('should return 401 if user is not authenticated', () => {
      const req = mockRequest({}) as AuthRequest;
      const res = mockResponse() as Response;
      const next = vi.fn() as NextFunction;

      const middleware = authorize('admin');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Authentication required' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if user does not have required role', () => {
      const req = mockRequest({}) as AuthRequest;
      req.user = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'customer',
      };
      const res = mockResponse() as Response;
      const next = vi.fn() as NextFunction;

      const middleware = authorize('admin');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Insufficient permissions' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next if user has required role', () => {
      const req = mockRequest({}) as AuthRequest;
      req.user = {
        id: 'user-123',
        email: 'admin@example.com',
        role: 'admin',
      };
      const res = mockResponse() as Response;
      const next = vi.fn() as NextFunction;

      const middleware = authorize('admin');
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should allow access if user has one of multiple required roles', () => {
      const req = mockRequest({}) as AuthRequest;
      req.user = {
        id: 'user-123',
        email: 'underwriter@example.com',
        role: 'underwriter',
      };
      const res = mockResponse() as Response;
      const next = vi.fn() as NextFunction;

      const middleware = authorize('admin', 'underwriter', 'manager');
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should deny access if user has none of the required roles', () => {
      const req = mockRequest({}) as AuthRequest;
      req.user = {
        id: 'user-123',
        email: 'customer@example.com',
        role: 'customer',
      };
      const res = mockResponse() as Response;
      const next = vi.fn() as NextFunction;

      const middleware = authorize('admin', 'underwriter');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Insufficient permissions' });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
