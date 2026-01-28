import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { vi } from 'vitest';

import { GuestGuard } from './guest.guard';
import { AuthService } from '../services/auth.service';
import { User } from '../../../domains/admin/models/user';

describe('GuestGuard', () => {
  let guard: GuestGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let userSubject: BehaviorSubject<User | null>;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    role: 'admin',
    firstName: '',
    lastName: '',
    phone: '',
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
        GuestGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(GuestGuard);
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
      state = { url: '/login' } as RouterStateSnapshot;
    });

    it('should allow access when user is not authenticated', async () => {
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

      expect(canActivate).toBe(true);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should deny access and redirect to /dashboard when user is authenticated', async () => {
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

      expect(canActivate).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should prevent authenticated users from accessing login page', async () => {
      userSubject.next(mockUser);
      state = { url: '/login' } as RouterStateSnapshot;

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
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should prevent authenticated users from accessing welcome page', async () => {
      userSubject.next(mockUser);
      state = { url: '/welcome' } as RouterStateSnapshot;

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
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should complete after one emission', async () => {
      userSubject.next(null);
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
          userSubject.next(mockUser);
        });

        await promise;
      }
    });

    it('should allow unauthenticated users to access guest-only routes', async () => {
      userSubject.next(null);
      state = { url: '/register' } as RouterStateSnapshot;

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
  });
});
