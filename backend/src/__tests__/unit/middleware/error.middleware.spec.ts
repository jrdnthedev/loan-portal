import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../../middleware/error.middleware';
import { mockRequest, mockResponse } from '../../helpers/mock-data';

describe('Error Middleware', () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('should return error with custom status and message', () => {
    const error = {
      status: 400,
      message: 'Bad request',
      stack: 'Error stack trace',
    };
    const req = mockRequest({}) as Request;
    const res = mockResponse() as Response;
    const next = vi.fn() as NextFunction;

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Bad request',
    });
  });

  it('should return 500 if no status is provided', () => {
    const error = {
      message: 'Something went wrong',
    };
    const req = mockRequest({}) as Request;
    const res = mockResponse() as Response;
    const next = vi.fn() as NextFunction;

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Something went wrong',
    });
  });

  it('should return default message if no message is provided', () => {
    const error = {};
    const req = mockRequest({}) as Request;
    const res = mockResponse() as Response;
    const next = vi.fn() as NextFunction;

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Internal server error',
    });
  });

  it('should include stack trace in development mode', () => {
    process.env.NODE_ENV = 'development';

    const error = {
      status: 404,
      message: 'Not found',
      stack: 'Error: Not found\n    at someFunction (file.ts:10:5)',
    };
    const req = mockRequest({}) as Request;
    const res = mockResponse() as Response;
    const next = vi.fn() as NextFunction;

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Not found',
      stack: expect.stringContaining('Error: Not found'),
    });
  });

  it('should not include stack trace in production mode', () => {
    process.env.NODE_ENV = 'production';

    const error = {
      status: 404,
      message: 'Not found',
      stack: 'Error: Not found\n    at someFunction (file.ts:10:5)',
    };
    const req = mockRequest({}) as Request;
    const res = mockResponse() as Response;
    const next = vi.fn() as NextFunction;

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Not found',
    });
    expect(res.json).not.toHaveBeenCalledWith(
      expect.objectContaining({
        stack: expect.anything(),
      }),
    );
  });

  it('should handle standard Error objects', () => {
    const error = new Error('Standard error');
    const req = mockRequest({}) as Request;
    const res = mockResponse() as Response;
    const next = vi.fn() as NextFunction;

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Standard error',
    });
  });
});
