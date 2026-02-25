import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { mockUser, mockRequest, mockResponse } from '../../helpers/mock-data';

// Mock the prisma module using vi.hoisted
const prismaMock = vi.hoisted(() => ({
  user: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('../../../lib/prisma', () => ({
  default: prismaMock,
}));

// Mock bcrypt
vi.mock('bcryptjs');

// Mock jsonwebtoken
vi.mock('jsonwebtoken');

import { login, register } from '../../../controllers/auth.controller';

describe('Auth Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should return 400 if email is missing', async () => {
      const req = mockRequest({ body: { password: 'password123' } }) as Request;
      const res = mockResponse() as Response;

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Email and password are required',
      });
    });

    it('should return 400 if password is missing', async () => {
      const req = mockRequest({ body: { email: 'test@example.com' } }) as Request;
      const res = mockResponse() as Response;

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Email and password are required',
      });
    });

    it('should return 401 if user is not found', async () => {
      const req = mockRequest({
        body: { email: 'test@example.com', password: 'password123' },
      }) as Request;
      const res = mockResponse() as Response;

      prismaMock.user.findUnique.mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('should return 401 if password is invalid', async () => {
      const req = mockRequest({
        body: { email: 'test@example.com', password: 'wrongpassword' },
      }) as Request;
      const res = mockResponse() as Response;
      const user = mockUser({ email: 'test@example.com', password: 'hashedpassword' });

      prismaMock.user.findUnique.mockResolvedValue(user);
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('should return user and token on successful login', async () => {
      const req = mockRequest({
        body: { email: 'test@example.com', password: 'password123' },
      }) as Request;
      const res = mockResponse() as Response;
      const user = mockUser({
        email: 'test@example.com',
        password: 'hashedpassword',
        role: 'customer',
      });
      const token = 'fake-jwt-token';

      prismaMock.user.findUnique.mockResolvedValue(user);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
      vi.mocked(jwt.sign).mockReturnValue(token as any);

      await login(req, res);

      expect(res.json).toHaveBeenCalledWith({
        user: expect.objectContaining({
          email: user.email,
          role: user.role,
        }),
        token,
        expiresIn: 86400,
      });
      expect(res.json).toHaveBeenCalledWith(
        expect.not.objectContaining({ password: expect.anything() }),
      );
    });

    it('should return 500 on server error', async () => {
      const req = mockRequest({
        body: { email: 'test@example.com', password: 'password123' },
      }) as Request;
      const res = mockResponse() as Response;

      prismaMock.user.findUnique.mockRejectedValue(new Error('Database error'));

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Login failed' });
    });
  });

  describe('register', () => {
    it('should return 400 if required fields are missing', async () => {
      const req = mockRequest({
        body: { email: 'test@example.com', password: 'password123' },
      }) as Request;
      const res = mockResponse() as Response;

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields' });
    });

    it('should return 400 if user already exists', async () => {
      const req = mockRequest({
        body: {
          email: 'test@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
        },
      }) as Request;
      const res = mockResponse() as Response;
      const existingUser = mockUser({ email: 'test@example.com' });

      prismaMock.user.findUnique.mockResolvedValue(existingUser);

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'User already exists' });
    });

    it('should create user and return token on successful registration', async () => {
      const req = mockRequest({
        body: {
          email: 'test@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
          phone: '1234567890',
        },
      }) as Request;
      const res = mockResponse() as Response;
      const hashedPassword = 'hashedpassword123';
      const token = 'fake-jwt-token';
      const newUser = mockUser({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: hashedPassword,
        role: 'customer',
      });

      prismaMock.user.findUnique.mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockResolvedValue(hashedPassword as never);
      prismaMock.user.create.mockResolvedValue(newUser);
      vi.mocked(jwt.sign).mockReturnValue(token as any);

      await register(req, res);

      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          password: hashedPassword,
          role: 'customer',
        }),
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        user: expect.objectContaining({
          email: newUser.email,
          firstName: newUser.firstName,
        }),
        token,
        expiresIn: 86400,
      });
      expect(res.json).toHaveBeenCalledWith(
        expect.not.objectContaining({ password: expect.anything() }),
      );
    });

    it('should use custom role if provided', async () => {
      const req = mockRequest({
        body: {
          email: 'admin@example.com',
          password: 'password123',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
        },
      }) as Request;
      const res = mockResponse() as Response;
      const hashedPassword = 'hashedpassword123';
      const token = 'fake-jwt-token';
      const adminUser = mockUser({
        email: 'admin@example.com',
        role: 'admin',
        password: hashedPassword,
      });

      prismaMock.user.findUnique.mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockResolvedValue(hashedPassword as never);
      prismaMock.user.create.mockResolvedValue(adminUser);
      vi.mocked(jwt.sign).mockReturnValue(token as any);

      await register(req, res);

      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          role: 'admin',
        }),
      });
    });

    it('should return 500 on server error', async () => {
      const req = mockRequest({
        body: {
          email: 'test@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
        },
      }) as Request;
      const res = mockResponse() as Response;

      prismaMock.user.findUnique.mockRejectedValue(new Error('Database error'));

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Registration failed' });
    });
  });
});
