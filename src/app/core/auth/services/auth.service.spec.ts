import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';

import { AuthService } from './auth.service';
import { TokenService } from './token.service';

describe('AuthService', () => {
  let service: AuthService;
  let tokenService: TokenService;
  let router: any;

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
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with unauthenticated state', () => {
    expect(service.isAuthenticated()).toBeFalsy();
    expect(service.user()).toBeNull();
    expect(service.isLoading()).toBeFalsy();
  });

  it('should handle logout correctly', () => {
    vi.spyOn(tokenService, 'clearTokens');

    service.logout();

    expect(tokenService.clearTokens).toHaveBeenCalled();
    expect(service.isAuthenticated()).toBeFalsy();
    expect(service.user()).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/welcome'], { queryParams: {} });
  });

  it('should check user roles correctly', () => {
    // Set up authenticated user with admin role
    const mockUser = {
      id: '1',
      email: 'admin@test.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      phone: '123-456-7890',
    };

    // Use the private method to set authenticated state for testing
    (service as any).setAuthenticatedState(mockUser);

    expect(service.hasRole('admin')).toBeTruthy();
    expect(service.hasRole('user')).toBeFalsy();
    expect(service.hasAnyRole(['admin', 'user'])).toBeTruthy();
    expect(service.hasAnyRole(['user', 'guest'])).toBeFalsy();
  });
});
