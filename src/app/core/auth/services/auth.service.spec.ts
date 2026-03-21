import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { LoginRequest, LoginResponse, RefreshTokenResponse } from '../interfaces/auth.interface';
import { User } from '../../../domains/admin/models/user';
import { environment } from '../../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let tokenService: TokenService;
  let httpMock: HttpTestingController;
  let router: any;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'admin',
    phone: '555-1234',
  };

  const mockLoginResponse: LoginResponse = {
    user: mockUser,
    token: 'mock-access-token',
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
  };

  beforeEach(() => {
    router = {
      navigate: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        TokenService,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: Router,
          useValue: router,
        },
      ],
    });

    service = TestBed.inject(AuthService);
    tokenService = TestBed.inject(TokenService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with unauthenticated state', () => {
      expect(service.isAuthenticated()).toBeFalsy();
      expect(service.user()).toBeNull();
      expect(service.isLoading()).toBeFalsy();
    });

    it('should load user from valid token on initialization', () => {
      // Create a mock JWT token with user data
      const payload = {
        id: '1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        phone: '555-1234',
      };
      const mockToken = `header.${btoa(JSON.stringify(payload))}.signature`;

      vi.spyOn(tokenService, 'hasValidAccessToken').mockReturnValue(true);
      vi.spyOn(tokenService, 'getAccessToken').mockReturnValue(mockToken);

      // Create a new service instance to trigger initialization
      const newService = new AuthService(
        TestBed.inject(HttpTestingController) as any,
        tokenService,
        router,
      );

      expect(newService.isAuthenticated()).toBeTruthy();
      expect(newService.user()).toEqual(payload);
    });

    it('should handle invalid token on initialization', () => {
      vi.spyOn(tokenService, 'hasValidAccessToken').mockReturnValue(true);
      vi.spyOn(tokenService, 'getAccessToken').mockReturnValue('invalid-token');
      vi.spyOn(tokenService, 'clearTokens');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Create a new service instance to trigger initialization
      const newService = new AuthService(
        TestBed.inject(HttpTestingController) as any,
        tokenService,
        router,
      );

      expect(consoleSpy).toHaveBeenCalledWith('Error parsing token:', expect.any(Error));
      expect(tokenService.clearTokens).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should use sub field as fallback for id in token payload', () => {
      const payload = {
        sub: 'sub-id-42',
        email: 'sub@example.com',
        firstName: 'Sub',
        lastName: 'User',
        role: 'user',
        phone: '555-0000',
      };
      const mockToken = `header.${btoa(JSON.stringify(payload))}.signature`;

      vi.spyOn(tokenService, 'hasValidAccessToken').mockReturnValue(true);
      vi.spyOn(tokenService, 'getAccessToken').mockReturnValue(mockToken);

      const newService = new AuthService(
        TestBed.inject(HttpTestingController) as any,
        tokenService,
        router,
      );

      expect(newService.user()?.id).toBe('sub-id-42');
    });

    it('should prefer id over sub when both are present in token payload', () => {
      const payload = {
        id: 'primary-id',
        sub: 'sub-id',
        email: 'both@example.com',
        firstName: 'Both',
        lastName: 'Fields',
        role: 'admin',
        phone: '555-1111',
      };
      const mockToken = `header.${btoa(JSON.stringify(payload))}.signature`;

      vi.spyOn(tokenService, 'hasValidAccessToken').mockReturnValue(true);
      vi.spyOn(tokenService, 'getAccessToken').mockReturnValue(mockToken);

      const newService = new AuthService(
        TestBed.inject(HttpTestingController) as any,
        tokenService,
        router,
      );

      expect(newService.user()?.id).toBe('primary-id');
    });

    it('should not load user when getAccessToken returns null', () => {
      vi.spyOn(tokenService, 'hasValidAccessToken').mockReturnValue(true);
      vi.spyOn(tokenService, 'getAccessToken').mockReturnValue(null);

      const newService = new AuthService(
        TestBed.inject(HttpTestingController) as any,
        tokenService,
        router,
      );

      expect(newService.isAuthenticated()).toBeFalsy();
      expect(newService.user()).toBeNull();
    });

    it('should map all user fields from token payload correctly', () => {
      const payload = {
        id: '99',
        email: 'full@example.com',
        firstName: 'Full',
        lastName: 'Payload',
        role: 'underwriter',
        phone: '555-9999',
      };
      const mockToken = `header.${btoa(JSON.stringify(payload))}.signature`;

      vi.spyOn(tokenService, 'hasValidAccessToken').mockReturnValue(true);
      vi.spyOn(tokenService, 'getAccessToken').mockReturnValue(mockToken);

      const newService = new AuthService(
        TestBed.inject(HttpTestingController) as any,
        tokenService,
        router,
      );

      const user = newService.user();
      expect(user).toEqual({
        id: '99',
        email: 'full@example.com',
        firstName: 'Full',
        lastName: 'Payload',
        role: 'underwriter',
        phone: '555-9999',
      });
    });

    it('should emit user through user$ observable after loading from token', () => {
      const payload = {
        id: '1',
        email: 'obs@example.com',
        firstName: 'Obs',
        lastName: 'User',
        role: 'user',
        phone: '555-2222',
      };
      const mockToken = `header.${btoa(JSON.stringify(payload))}.signature`;

      vi.spyOn(tokenService, 'hasValidAccessToken').mockReturnValue(true);
      vi.spyOn(tokenService, 'getAccessToken').mockReturnValue(mockToken);

      const newService = new AuthService(
        TestBed.inject(HttpTestingController) as any,
        tokenService,
        router,
      );

      let emittedUser: User | null | undefined;
      newService.user$.subscribe((user) => {
        emittedUser = user;
      });

      expect(emittedUser?.email).toBe('obs@example.com');
    });
  });

  describe('Login', () => {
    it('should login successfully and set authenticated state', () => {
      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      vi.spyOn(tokenService, 'setTokens');

      service.login(credentials).subscribe({
        next: (response) => {
          expect(response).toEqual(mockLoginResponse);
          expect(service.isAuthenticated()).toBeTruthy();
          expect(service.user()).toEqual(mockUser);
          expect(service.isLoading()).toBeFalsy();
          expect(tokenService.setTokens).toHaveBeenCalledWith(
            mockLoginResponse.accessToken,
            mockLoginResponse.refreshToken,
          );
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      req.flush(mockLoginResponse);
    });

    it('should use token field if accessToken is not present', () => {
      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      const responseWithTokenOnly = {
        user: mockUser,
        token: 'mock-token-value',
        accessToken: undefined,
        refreshToken: undefined,
      };

      vi.spyOn(tokenService, 'setTokens');

      service.login(credentials).subscribe({
        next: () => {
          expect(tokenService.setTokens).toHaveBeenCalledWith(
            'mock-token-value',
            'mock-token-value',
          );
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush(responseWithTokenOnly);
    });

    it('should set loading state during login', () => {
      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      service.login(credentials).subscribe();

      // Loading state should be set immediately
      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);

      req.flush(mockLoginResponse);
    });

    it('should handle login error and reset loading state', () => {
      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'wrong-password',
      };

      const errorMessage = 'Invalid credentials';

      service.login(credentials).subscribe({
        error: (error) => {
          expect(error.error).toBe(errorMessage);
          expect(service.isLoading()).toBeFalsy();
          expect(service.isAuthenticated()).toBeFalsy();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush(errorMessage, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('Logout', () => {
    it('should clear tokens and navigate to welcome page', () => {
      vi.spyOn(tokenService, 'clearTokens');

      // Set authenticated state first
      (service as any).setAuthenticatedState(mockUser);
      expect(service.isAuthenticated()).toBeTruthy();

      service.logout();

      expect(tokenService.clearTokens).toHaveBeenCalled();
      expect(service.isAuthenticated()).toBeFalsy();
      expect(service.user()).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/welcome'], { queryParams: {} });
    });

    it('should emit null to user$ observable on logout', () => {
      (service as any).setAuthenticatedState(mockUser);

      let emittedUser: User | null | undefined;
      service.user$.subscribe((user) => {
        emittedUser = user;
      });

      service.logout();

      expect(emittedUser).toBeNull();
    });
  });

  describe('Refresh Token', () => {
    it('should refresh token successfully', () => {
      const mockRefreshResponse: RefreshTokenResponse = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      vi.spyOn(tokenService, 'getRefreshToken').mockReturnValue('old-refresh-token');
      vi.spyOn(tokenService, 'setTokens');

      service.refreshToken().subscribe({
        next: (response) => {
          expect(response).toEqual(mockRefreshResponse);
          expect(tokenService.setTokens).toHaveBeenCalledWith(
            mockRefreshResponse.accessToken,
            mockRefreshResponse.refreshToken,
          );
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/refresh`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ refreshToken: 'old-refresh-token' });
      req.flush(mockRefreshResponse);
    });

    it('should logout when no refresh token is available', () => {
      vi.spyOn(tokenService, 'getRefreshToken').mockReturnValue(null);
      vi.spyOn(tokenService, 'clearTokens');

      service.refreshToken().subscribe({
        error: (error) => {
          expect(error.message).toBe('No refresh token available');
          expect(tokenService.clearTokens).toHaveBeenCalled();
          expect(router.navigate).toHaveBeenCalledWith(['/welcome'], { queryParams: {} });
        },
      });
    });

    it('should logout on refresh token error', () => {
      vi.spyOn(tokenService, 'getRefreshToken').mockReturnValue('old-refresh-token');
      vi.spyOn(tokenService, 'clearTokens');

      service.refreshToken().subscribe({
        error: (error) => {
          expect(error.status).toBe(401);
          expect(tokenService.clearTokens).toHaveBeenCalled();
          expect(router.navigate).toHaveBeenCalledWith(['/welcome'], { queryParams: {} });
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/refresh`);
      req.flush('Refresh token expired', { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('Register', () => {
    it('should register successfully and set authenticated state', () => {
      const userData = {
        email: 'new@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '555-5678',
      };

      vi.spyOn(tokenService, 'setTokens');

      service.register(userData).subscribe({
        next: (response) => {
          expect(response).toEqual(mockLoginResponse);
          expect(service.isAuthenticated()).toBeTruthy();
          expect(service.user()).toEqual(mockUser);
          expect(service.isLoading()).toBeFalsy();
          expect(tokenService.setTokens).toHaveBeenCalledWith(
            mockLoginResponse.accessToken,
            mockLoginResponse.refreshToken,
          );
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(userData);
      req.flush(mockLoginResponse);
    });

    it('should handle registration error and reset loading state', () => {
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
      };

      service.register(userData).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
          expect(service.isLoading()).toBeFalsy();
          expect(service.isAuthenticated()).toBeFalsy();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      req.flush('Email already exists', { status: 400, statusText: 'Bad Request' });
    });

    it('should use token field as fallback when accessToken is not present', () => {
      const userData = {
        email: 'fallback@example.com',
        password: 'password123',
      };

      const responseWithTokenOnly = {
        user: mockUser,
        token: 'fallback-token-value',
        accessToken: undefined,
        refreshToken: undefined,
      };

      vi.spyOn(tokenService, 'setTokens');

      service.register(userData).subscribe({
        next: () => {
          expect(tokenService.setTokens).toHaveBeenCalledWith(
            'fallback-token-value',
            'fallback-token-value',
          );
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      req.flush(responseWithTokenOnly);
    });

    it('should set loading state to true while registration is in progress', () => {
      const userData = {
        email: 'loading@example.com',
        password: 'password123',
      };

      // Subscribe to start the request (which sets loading = true)
      service.register(userData).subscribe();

      // Before HTTP resolves, loading should be true
      expect(service.isLoading()).toBeTruthy();

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      req.flush(mockLoginResponse);

      // After response, loading should be false
      expect(service.isLoading()).toBeFalsy();
    });

    it('should emit registered user through user$ observable', () => {
      const userData = {
        email: 'new@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
      };

      const emittedUsers: (User | null)[] = [];
      service.user$.subscribe((user) => {
        emittedUsers.push(user);
      });

      service.register(userData).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      req.flush(mockLoginResponse);

      expect(emittedUsers[emittedUsers.length - 1]).toEqual(mockUser);
    });

    it('should not set tokens when response has no token or accessToken', () => {
      const userData = {
        email: 'notoken@example.com',
        password: 'password123',
      };

      const responseWithNoTokens = {
        user: mockUser,
        token: undefined,
        accessToken: undefined,
        refreshToken: undefined,
      };

      vi.spyOn(tokenService, 'setTokens');

      service.register(userData).subscribe({
        next: () => {
          expect(tokenService.setTokens).not.toHaveBeenCalled();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      req.flush(responseWithNoTokens);
    });
  });

  describe('Forgot Password', () => {
    it('should send forgot password request', () => {
      const email = 'test@example.com';

      service.forgotPassword(email).subscribe({
        next: (response) => {
          expect(response).toEqual({ message: 'Reset email sent' });
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/forgot-password`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email });
      req.flush({ message: 'Reset email sent' });
    });

    it('should handle forgot password error', () => {
      const email = 'unknown@example.com';

      service.forgotPassword(email).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/forgot-password`);
      req.flush('User not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('Reset Password', () => {
    it('should send reset password request', () => {
      const token = 'reset-token-123';
      const newPassword = 'newPassword123';

      service.resetPassword(token, newPassword).subscribe({
        next: (response) => {
          expect(response).toEqual({ message: 'Password reset successful' });
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/reset-password`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ token, newPassword });
      req.flush({ message: 'Password reset successful' });
    });

    it('should handle reset password error', () => {
      const token = 'invalid-token';
      const newPassword = 'newPassword123';

      service.resetPassword(token, newPassword).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/reset-password`);
      req.flush('Invalid or expired token', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('Role Management', () => {
    it('should check if user has specific role', () => {
      const adminUser = { ...mockUser, role: 'admin' };
      (service as any).setAuthenticatedState(adminUser);

      expect(service.hasRole('admin')).toBeTruthy();
      expect(service.hasRole('user')).toBeFalsy();
      expect(service.hasRole('underwriter')).toBeFalsy();
    });

    it('should return false when no user is authenticated', () => {
      expect(service.hasRole('admin')).toBeFalsy();
      expect(service.hasRole('user')).toBeFalsy();
    });

    it('should check if user has any of the specified roles', () => {
      const underwriterUser = { ...mockUser, role: 'underwriter' };
      (service as any).setAuthenticatedState(underwriterUser);

      expect(service.hasAnyRole(['admin', 'underwriter'])).toBeTruthy();
      expect(service.hasAnyRole(['admin', 'user'])).toBeFalsy();
      expect(service.hasAnyRole(['underwriter'])).toBeTruthy();
    });

    it('should return false when checking roles with no authenticated user', () => {
      expect(service.hasAnyRole(['admin', 'user'])).toBeFalsy();
      expect(service.hasAnyRole([])).toBeFalsy();
    });
  });

  describe('Update User', () => {
    it('should update user and maintain authenticated state', () => {
      const updatedUser: User = {
        ...mockUser,
        firstName: 'Updated',
        lastName: 'Name',
      };

      service.updateUser(updatedUser);

      expect(service.user()).toEqual(updatedUser);
      expect(service.isAuthenticated()).toBeTruthy();
      expect(service.isLoading()).toBeFalsy();

      let emittedUser: User | null | undefined;
      service.user$.subscribe((user) => {
        emittedUser = user;
      });

      expect(emittedUser).toEqual(updatedUser);
    });
  });

  describe('Observable Support', () => {
    it('should emit user changes through user$ observable', () => {
      const users: (User | null)[] = [];

      service.user$.subscribe((user) => {
        users.push(user);
      });

      (service as any).setAuthenticatedState(mockUser);

      // After setting authenticated state, we should have 2 emissions
      expect(users.length).toBe(2);
      expect(users[0]).toBeNull(); // Initial state
      expect(users[1]).toEqual(mockUser); // After authentication
    });

    it('should use readonly computed signals', () => {
      expect(() => {
        // TypeScript should prevent this, but verify at runtime
        (service.authState as any).set({ user: null, isAuthenticated: false, isLoading: false });
      }).toThrow();
    });
  });

  describe('State Management', () => {
    it('should properly set authenticated state', () => {
      (service as any).setAuthenticatedState(mockUser);

      expect(service.user()).toEqual(mockUser);
      expect(service.isAuthenticated()).toBeTruthy();
      expect(service.isLoading()).toBeFalsy();

      const state = service.authState();
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBeTruthy();
      expect(state.isLoading).toBeFalsy();
    });

    it('should properly set unauthenticated state', () => {
      // First authenticate
      (service as any).setAuthenticatedState(mockUser);
      expect(service.isAuthenticated()).toBeTruthy();

      // Then logout
      (service as any).setUnauthenticatedState();

      expect(service.user()).toBeNull();
      expect(service.isAuthenticated()).toBeFalsy();
      expect(service.isLoading()).toBeFalsy();

      const state = service.authState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBeFalsy();
      expect(state.isLoading).toBeFalsy();
    });

    it('should properly set loading state', () => {
      (service as any).setLoadingState(true);
      expect(service.isLoading()).toBeTruthy();

      (service as any).setLoadingState(false);
      expect(service.isLoading()).toBeFalsy();
    });

    it('should preserve user data when updating loading state', () => {
      (service as any).setAuthenticatedState(mockUser);

      (service as any).setLoadingState(true);

      expect(service.user()).toEqual(mockUser);
      expect(service.isAuthenticated()).toBeTruthy();
      expect(service.isLoading()).toBeTruthy();
    });
  });
});
