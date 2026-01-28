import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { of } from 'rxjs';

import { Shell } from './shell';
import { AdminStore } from '../../../domains/admin/store/admin.store';
import { AuthService } from '../../../core';
import { User } from '../../../domains/admin/models/user';
import { LoanApplicationStore } from '../../../domains/loan-application/store/loan-application.store';

describe('Shell', () => {
  let component: Shell;
  let fixture: ComponentFixture<Shell>;
  let adminStore: any;
  let authService: any;
  let loanStore: any;

  beforeEach(async () => {
    adminStore = {
      users: signal<User[]>([]),
      filteredUsers: signal<User[]>([]),
      filterUsersByType: vi.fn(),
    };

    authService = {
      hasRole: vi.fn(() => false),
      authState: signal({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }),
    };

    loanStore = {
      userLoans$: of([]),
    };

    await TestBed.configureTestingModule({
      imports: [Shell],
      providers: [
        provideRouter([]),
        { provide: AdminStore, useValue: adminStore },
        { provide: AuthService, useValue: authService },
        { provide: LoanApplicationStore, useValue: loanStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Shell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('userData computed', () => {
    it('should return empty array when no users exist', () => {
      adminStore.users.set([]);
      expect(component.userData()).toEqual([]);
    });

    it('should transform users to display format', () => {
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'user1@example.com',
          role: 'admin',
          firstName: 'John',
          lastName: 'Doe',
          phone: '123-456-7890',
        },
        {
          id: '2',
          email: 'user2@example.com',
          role: 'loan-officer',
          firstName: 'Jane',
          lastName: 'Smith',
          phone: '987-654-3210',
        },
      ];

      adminStore.users.set(mockUsers);

      const userData = component.userData();
      expect(userData).toEqual([
        { id: '1', email: 'user1@example.com', role: 'admin' },
        { id: '2', email: 'user2@example.com', role: 'loan-officer' },
      ]);
    });

    it('should only include email, id, and role fields', () => {
      const mockUser: User = {
        id: '123',
        email: 'test@example.com',
        role: 'admin',
        firstName: 'Test',
        lastName: 'User',
        phone: '555-1234',
      };

      adminStore.users.set([mockUser]);

      const userData = component.userData();
      expect(userData[0].email).toBeDefined();
      expect(userData[0].id).toBeDefined();
      expect(userData[0].role).toBeDefined();
      expect('firstName' in userData[0]).toBe(false);
      expect('lastName' in userData[0]).toBe(false);
      expect('phone' in userData[0]).toBe(false);
    });

    it('should return empty array on error', () => {
      // Create a mock that throws an error
      vi.spyOn(console, 'error').mockImplementation(() => {});
      adminStore.users = vi.fn(() => {
        throw new Error('Test error');
      });

      const userData = component.userData();
      expect(userData).toEqual([]);
      expect(console.error).toHaveBeenCalled();

      vi.restoreAllMocks();
    });
  });

  describe('Template rendering', () => {
    it('should render dashboard component', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const dashboard = compiled.querySelector('app-dashboard');
      expect(dashboard).toBeTruthy();
    });

    it('should render loan application wizard link', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const links = compiled.querySelectorAll('a[routerLink]');
      const wizardLink = Array.from(links).find(
        (link) => link.getAttribute('routerLink') === '/loan-application/wizard',
      );
      expect(wizardLink).toBeTruthy();
      expect(wizardLink?.textContent?.trim()).toBe('Loan Application Wizard');
    });

    it('should render underwriting panel link', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const links = compiled.querySelectorAll('a[routerLink]');
      const underwritingLink = Array.from(links).find(
        (link) => link.getAttribute('routerLink') === '/underwriting',
      );
      expect(underwritingLink).toBeTruthy();
      expect(underwritingLink?.textContent?.trim()).toBe('Underwriting Panel');
    });

    it('should render user table when user has loan-officer role', () => {
      // Set up mock users data before creating the component
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'user1@example.com',
          role: 'admin',
          firstName: 'John',
          lastName: 'Doe',
          phone: '123-456-7890',
        },
      ];

      // Configure the mock to return true consistently
      authService.hasRole.mockReturnValue(true);
      adminStore.users.set(mockUsers);

      // Need to recreate fixture with the updated mock
      const newFixture = TestBed.createComponent(Shell);
      const newComponent = newFixture.componentInstance;

      // First change detection without checking to avoid ExpressionChangedAfterItHasBeenCheckedError
      newFixture.componentRef.hostView.detectChanges();

      const compiled = newFixture.nativeElement as HTMLElement;
      const userTable = compiled.querySelector('app-table');
      expect(userTable).toBeTruthy();

      // Verify the mock was called
      expect(authService.hasRole).toHaveBeenCalled();
    });

    it('should not render user table when user does not have loan-officer role', async () => {
      authService.hasRole.mockImplementation((role: string) => false);

      // Need to recreate fixture with the updated mock
      const newFixture = TestBed.createComponent(Shell);
      newFixture.detectChanges();

      // Wait for change detection to settle in zoneless environment
      await new Promise((resolve) => setTimeout(resolve, 0));
      newFixture.detectChanges();

      const compiled = newFixture.nativeElement as HTMLElement;
      const userTable = compiled.querySelector('app-table');
      expect(userTable).toBeFalsy();
    });

    it('should render all card components', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const cards = compiled.querySelectorAll('app-card');
      expect(cards.length).toBeGreaterThanOrEqual(3);
    });
  });
});
