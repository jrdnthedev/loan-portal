import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { TokenService } from './token.service';

describe('AuthService', () => {
  let service: AuthService;
  let tokenService: TokenService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        TokenService,
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate') },
        },
      ],
    });

    service = TestBed.inject(AuthService);
    tokenService = TestBed.inject(TokenService);
    router = TestBed.inject(Router);
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
    spyOn(tokenService, 'clearTokens');

    service.logout();

    expect(tokenService.clearTokens).toHaveBeenCalled();
    expect(service.isAuthenticated()).toBeFalsy();
    expect(service.user()).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should check user roles correctly', () => {
    // Set up authenticated user with admin role
    const mockUser = {
      id: '1',
      email: 'admin@test.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
    };

    // Use the private method to set authenticated state for testing
    (service as any).setAuthenticatedState(mockUser);

    expect(service.hasRole('admin')).toBeTruthy();
    expect(service.hasRole('user')).toBeFalsy();
    expect(service.hasAnyRole(['admin', 'user'])).toBeTruthy();
    expect(service.hasAnyRole(['user', 'guest'])).toBeFalsy();
  });
});
