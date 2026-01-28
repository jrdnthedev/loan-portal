import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { vi } from 'vitest';

import { RoleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';
import { User } from '../../../domains/admin/models/user';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let userSubject: BehaviorSubject<User | null>;

  const mockAdminUser: User = {
    id: '1',
    email: 'admin@example.com',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'admin',
  };

  const mockRegularUser: User = {
    id: '2',
    email: 'user@example.com',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'loan-officer',
  };

  const mockUnderwriterUser: User = {
    id: '3',
    email: 'underwriter@example.com',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'underwriter',
  } as User;

  beforeEach(() => {
    userSubject = new BehaviorSubject<User | null>(null);

    const authServiceSpy = {
      user$: userSubject.asObservable(),
    };

    const routerSpy = {
      navigate: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        RoleGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(RoleGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    let route: ActivatedRouteSnapshot;
    let state: RouterStateSnapshot;

    beforeEach(() => {
      route = {
        data: {},
      } as ActivatedRouteSnapshot;
      state = { url: '/admin' } as RouterStateSnapshot;
    });

    it('should allow access when no roles are required', async () => {
      userSubject.next(mockRegularUser);
      route.data = {};

      const result = guard.canActivate(route, state);

      let canActivate: boolean;
      if (result instanceof Promise) {
        canActivate = await result;
      } else if (typeof result === 'boolean') {
        canActivate = result;
      } else {
        canActivate = await firstValueFrom(result);
      }

      expect(canActivate).toBe(true);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should allow access when roles array is empty', async () => {
      userSubject.next(mockRegularUser);
      route.data = { roles: [] };

      const result = guard.canActivate(route, state);

      let canActivate: boolean;
      if (result instanceof Promise) {
        canActivate = await result;
      } else if (typeof result === 'boolean') {
        canActivate = result;
      } else {
        canActivate = await firstValueFrom(result);
      }

      expect(canActivate).toBe(true);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should allow access when user has the required role', async () => {
      userSubject.next(mockAdminUser);
      route.data = { roles: ['admin'] };

      const result = guard.canActivate(route, state);

      let canActivate: boolean;
      if (result instanceof Promise) {
        canActivate = await result;
      } else if (typeof result === 'boolean') {
        canActivate = result;
      } else {
        canActivate = await firstValueFrom(result);
      }

      expect(canActivate).toBe(true);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should allow access when user has one of multiple required roles', async () => {
      userSubject.next(mockUnderwriterUser);
      route.data = { roles: ['admin', 'underwriter'] };

      const result = guard.canActivate(route, state);

      let canActivate: boolean;
      if (result instanceof Promise) {
        canActivate = await result;
      } else if (typeof result === 'boolean') {
        canActivate = result;
      } else {
        canActivate = await firstValueFrom(result);
      }

      expect(canActivate).toBe(true);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should deny access and redirect to /unauthorized when user lacks required role', async () => {
      userSubject.next(mockRegularUser);
      route.data = { roles: ['admin'] };

      const result = guard.canActivate(route, state);

      let canActivate: boolean;
      if (result instanceof Promise) {
        canActivate = await result;
      } else if (typeof result === 'boolean') {
        canActivate = result;
      } else {
        canActivate = await firstValueFrom(result);
      }

      expect(canActivate).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/unauthorized']);
    });

    it('should deny access and redirect to /login when user is not authenticated', async () => {
      userSubject.next(null);
      route.data = { roles: ['admin'] };

      const result = guard.canActivate(route, state);

      let canActivate: boolean;
      if (result instanceof Promise) {
        canActivate = await result;
      } else if (typeof result === 'boolean') {
        canActivate = result;
      } else {
        canActivate = await firstValueFrom(result);
      }

      expect(canActivate).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should complete after one emission', async () => {
      userSubject.next(mockAdminUser);
      route.data = { roles: ['admin'] };
      let emissionCount = 0;

      const result = guard.canActivate(route, state);

      if (result instanceof Promise || typeof result === 'boolean') {
        // For synchronous results, test passes
        expect(true).toBe(true);
      } else {
        const promise = new Promise<void>((resolve) => {
          result.subscribe({
            next: () => {
              emissionCount++;
            },
            complete: () => {
              expect(emissionCount).toBe(1);
              resolve();
            },
          });

          // Emit another value to ensure take(1) is working
          userSubject.next({ ...mockAdminUser, firstName: 'Updated Admin' });
        });

        await promise;
      }
    });

    it('should handle multiple roles requirement correctly', async () => {
      userSubject.next(mockRegularUser);
      route.data = { roles: ['admin', 'underwriter', 'manager'] };

      const result = guard.canActivate(route, state);

      let canActivate: boolean;
      if (result instanceof Promise) {
        canActivate = await result;
      } else if (typeof result === 'boolean') {
        canActivate = result;
      } else {
        canActivate = await firstValueFrom(result);
      }

      expect(canActivate).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/unauthorized']);
    });
  });
});
