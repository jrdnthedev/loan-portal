import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { of, throwError, delay } from 'rxjs';

import { AuthInterceptor } from './auth.interceptor';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';

describe('AuthInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let tokenService: TokenService;
  let authService: AuthService;
  let interceptor: AuthInterceptor;

  const mockAccessToken = 'mock-access-token';
  const mockRefreshResponse = {
    accessToken: 'new-access-token',
    refreshToken: 'new-refresh-token',
  };

  beforeEach(() => {
    const tokenServiceMock = {
      getAccessToken: vi.fn(),
      setTokens: vi.fn(),
      clearTokens: vi.fn(),
    };

    const authServiceMock = {
      refreshToken: vi.fn(),
      logout: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthInterceptor,
        { provide: TokenService, useValue: tokenServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
    authService = TestBed.inject(AuthService);
    interceptor = TestBed.inject(AuthInterceptor);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  describe('Request without token', () => {
    it('should not add Authorization header when no token is available', () => {
      vi.mocked(tokenService.getAccessToken).mockReturnValue(null);

      httpClient.get('/api/data').subscribe();

      const req = httpMock.expectOne('/api/data');
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
    });
  });

  describe('Request with token', () => {
    it('should add Authorization header when token is available', () => {
      vi.mocked(tokenService.getAccessToken).mockReturnValue(mockAccessToken);

      httpClient.get('/api/data').subscribe();

      const req = httpMock.expectOne('/api/data');
      expect(req.request.headers.has('Authorization')).toBe(true);
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockAccessToken}`);
      req.flush({});
    });

    it('should handle successful response', () => {
      vi.mocked(tokenService.getAccessToken).mockReturnValue(mockAccessToken);
      const mockResponse = { data: 'test' };

      httpClient.get('/api/data').subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/api/data');
      req.flush(mockResponse);
    });
  });

  describe('Auth endpoints', () => {
    it('should skip Authorization header for /auth/login', () => {
      vi.mocked(tokenService.getAccessToken).mockReturnValue(mockAccessToken);

      httpClient.post('/auth/login', { username: 'test', password: 'test' }).subscribe();

      const req = httpMock.expectOne('/auth/login');
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
    });

    it('should skip Authorization header for /auth/register', () => {
      vi.mocked(tokenService.getAccessToken).mockReturnValue(mockAccessToken);

      httpClient.post('/auth/register', {}).subscribe();

      const req = httpMock.expectOne('/auth/register');
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
    });

    it('should skip Authorization header for /auth/refresh', () => {
      vi.mocked(tokenService.getAccessToken).mockReturnValue(mockAccessToken);

      httpClient.post('/auth/refresh', {}).subscribe();

      const req = httpMock.expectOne('/auth/refresh');
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
    });

    it('should skip Authorization header for /auth/forgot-password', () => {
      vi.mocked(tokenService.getAccessToken).mockReturnValue(mockAccessToken);

      httpClient.post('/auth/forgot-password', {}).subscribe();

      const req = httpMock.expectOne('/auth/forgot-password');
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
    });

    it('should skip Authorization header for /auth/reset-password', () => {
      vi.mocked(tokenService.getAccessToken).mockReturnValue(mockAccessToken);

      httpClient.post('/auth/reset-password', {}).subscribe();

      const req = httpMock.expectOne('/auth/reset-password');
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
    });

    it('should skip Authorization header for URLs containing auth endpoints', () => {
      vi.mocked(tokenService.getAccessToken).mockReturnValue(mockAccessToken);

      httpClient.post('http://localhost:3000/auth/login', {}).subscribe();

      const req = httpMock.expectOne('http://localhost:3000/auth/login');
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
    });
  });

  describe('401 Error handling', () => {
    it('should refresh token on 401 error and retry the request', () => {
      vi.mocked(tokenService.getAccessToken).mockReturnValue(mockAccessToken);
      vi.mocked(authService.refreshToken).mockReturnValue(of(mockRefreshResponse));

      httpClient.get('/api/protected').subscribe((response) => {
        expect(response).toEqual({ data: 'success' });
      });

      // First request with old token
      const req1 = httpMock.expectOne('/api/protected');
      expect(req1.request.headers.get('Authorization')).toBe(`Bearer ${mockAccessToken}`);
      req1.flush(null, { status: 401, statusText: 'Unauthorized' });

      // Retried request with new token
      const req2 = httpMock.expectOne('/api/protected');
      expect(req2.request.headers.get('Authorization')).toBe(
        `Bearer ${mockRefreshResponse.accessToken}`,
      );
      req2.flush({ data: 'success' });

      expect(authService.refreshToken).toHaveBeenCalledOnce();
    });

    it('should logout on refresh token failure', () => {
      vi.mocked(tokenService.getAccessToken).mockReturnValue(mockAccessToken);
      vi.mocked(authService.refreshToken).mockReturnValue(
        throwError(() => new Error('Refresh failed')),
      );

      httpClient.get('/api/protected').subscribe({
        next: () => {
          // Should not reach here
          expect(true).toBe(false);
        },
        error: (error) => {
          expect(error.message).toBe('Refresh failed');
          expect(authService.logout).toHaveBeenCalledOnce();
        },
      });

      const req = httpMock.expectOne('/api/protected');
      req.flush(null, { status: 401, statusText: 'Unauthorized' });
    });

    it('should handle concurrent 401 errors with single token refresh', async () => {
      vi.mocked(tokenService.getAccessToken).mockReturnValue(mockAccessToken);
      // Use delay(0) to make the refresh async, ensuring concurrent requests are handled before completion
      vi.mocked(authService.refreshToken).mockReturnValue(of(mockRefreshResponse).pipe(delay(0)));

      const promises = [
        new Promise<void>((resolve) => {
          httpClient.get('/api/protected1').subscribe(() => resolve());
        }),
        new Promise<void>((resolve) => {
          httpClient.get('/api/protected2').subscribe(() => resolve());
        }),
      ];

      // Both initial requests fail with 401
      const req1 = httpMock.expectOne('/api/protected1');
      const req2 = httpMock.expectOne('/api/protected2');

      req1.flush(null, { status: 401, statusText: 'Unauthorized' });
      req2.flush(null, { status: 401, statusText: 'Unauthorized' });

      // Wait for the refresh token to complete (delay(0) makes it async)
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Both requests should be retried with new token
      const retryReq1 = httpMock.expectOne('/api/protected1');
      const retryReq2 = httpMock.expectOne('/api/protected2');

      expect(retryReq1.request.headers.get('Authorization')).toBe(
        `Bearer ${mockRefreshResponse.accessToken}`,
      );
      expect(retryReq2.request.headers.get('Authorization')).toBe(
        `Bearer ${mockRefreshResponse.accessToken}`,
      );

      retryReq1.flush({});
      retryReq2.flush({});

      await Promise.all(promises);

      // Verify refreshToken was only called once
      expect(authService.refreshToken).toHaveBeenCalledOnce();
    });

    it('should not attempt token refresh on 401 when no token exists', () => {
      vi.mocked(tokenService.getAccessToken).mockReturnValue(null);

      httpClient.get('/api/protected').subscribe({
        next: () => {
          // Should not reach here
          expect(true).toBe(false);
        },
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(401);
          expect(authService.refreshToken).not.toHaveBeenCalled();
        },
      });

      const req = httpMock.expectOne('/api/protected');
      req.flush(null, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('Non-401 Error handling', () => {
    it('should propagate non-401 errors without refresh attempt', () => {
      vi.mocked(tokenService.getAccessToken).mockReturnValue(mockAccessToken);

      httpClient.get('/api/protected').subscribe({
        next: () => {
          // Should not reach here
          expect(true).toBe(false);
        },
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
          expect(authService.refreshToken).not.toHaveBeenCalled();
        },
      });

      const req = httpMock.expectOne('/api/protected');
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });
    });

    it('should propagate 403 errors without refresh attempt', () => {
      vi.mocked(tokenService.getAccessToken).mockReturnValue(mockAccessToken);

      httpClient.get('/api/protected').subscribe({
        next: () => {
          // Should not reach here
          expect(true).toBe(false);
        },
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(403);
          expect(authService.refreshToken).not.toHaveBeenCalled();
        },
      });

      const req = httpMock.expectOne('/api/protected');
      req.flush(null, { status: 403, statusText: 'Forbidden' });
    });

    it('should propagate 404 errors without refresh attempt', () => {
      vi.mocked(tokenService.getAccessToken).mockReturnValue(mockAccessToken);

      httpClient.get('/api/nonexistent').subscribe({
        next: () => {
          // Should not reach here
          expect(true).toBe(false);
        },
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
          expect(authService.refreshToken).not.toHaveBeenCalled();
        },
      });

      const req = httpMock.expectOne('/api/nonexistent');
      req.flush(null, { status: 404, statusText: 'Not Found' });
    });
  });
});
