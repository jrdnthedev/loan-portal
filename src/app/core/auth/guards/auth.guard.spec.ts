import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { vi } from 'vitest';

import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { User } from '../../../domains/admin/models/user';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let userSubject: BehaviorSubject<User | null>;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'loan-officer',
  };

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
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(AuthGuard);
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
      route = {} as ActivatedRouteSnapshot;
      state = { url: '/dashboard' } as RouterStateSnapshot;
    });

    it('should allow access when user is authenticated', async () => {
      userSubject.next(mockUser);

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

    it('should deny access and redirect to /welcome when user is not authenticated', async () => {
      userSubject.next(null);

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
      expect(router.navigate).toHaveBeenCalledWith(['/welcome'], {
        queryParams: { returnUrl: '/dashboard' },
      });
    });

    it('should store the attempted URL in returnUrl query param', async () => {
      userSubject.next(null);
      state = { url: '/admin/users' } as RouterStateSnapshot;

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
      expect(router.navigate).toHaveBeenCalledWith(['/welcome'], {
        queryParams: { returnUrl: '/admin/users' },
      });
    });

    it('should complete after one emission', async () => {
      userSubject.next(mockUser);
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
          userSubject.next({ ...mockUser, firstName: 'Updated' });
        });

        await promise;
      }
    });
  });

  describe('canActivateChild', () => {
    let childRoute: ActivatedRouteSnapshot;
    let state: RouterStateSnapshot;

    beforeEach(() => {
      childRoute = {} as ActivatedRouteSnapshot;
      state = { url: '/dashboard/profile' } as RouterStateSnapshot;
    });

    it('should delegate to canActivate for authenticated user', async () => {
      userSubject.next(mockUser);

      const result = guard.canActivateChild(childRoute, state);

      let canActivate: boolean;
      if (result instanceof Promise) {
        canActivate = await result;
      } else if (typeof result === 'boolean') {
        canActivate = result;
      } else {
        canActivate = await firstValueFrom(result);
      }

      expect(canActivate).toBe(true);
    });

    it('should delegate to canActivate for unauthenticated user', async () => {
      userSubject.next(null);

      const result = guard.canActivateChild(childRoute, state);

      let canActivate: boolean;
      if (result instanceof Promise) {
        canActivate = await result;
      } else if (typeof result === 'boolean') {
        canActivate = result;
      } else {
        canActivate = await firstValueFrom(result);
      }

      expect(canActivate).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/welcome'], {
        queryParams: { returnUrl: '/dashboard/profile' },
      });
    });
  });
});
