import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { vi } from 'vitest';

import { Shell } from './shell';
import { AdminStore } from '../../../domains/admin/store/admin.store';
import { AuthService } from '../../../core';
import { User } from '../../../domains/admin/models/user';
import { LoanApplicationStore } from '../../../domains/loan-application/store/loan-application.store';

describe('Shell', () => {
  let component: Shell;
  let fixture: ComponentFixture<Shell>;
  let mockAdminStore: any;
  let mockAuthService: any;
  let mockLoanStore: any;

  const mockUsers: User[] = [
    {
      id: 'user-001',
      firstName: 'john.doe',
      email: 'john.doe@example.com',
      lastName: 'John Doe',
      role: 'admin',
      phone: '',
    },
    {
      id: 'user-002',
      firstName: 'jane.officer',
      email: 'jane.officer@example.com',
      lastName: 'Jane Officer',
      role: 'loan-officer',
      phone: '',
    },
    {
      id: 'user-003',
      firstName: 'admin.user',
      email: 'admin@example.com',
      lastName: 'Admin User',
      role: 'admin',
      phone: '',
    },
  ];

  beforeEach(async () => {
    mockAdminStore = {
      users: signal<User[]>(mockUsers),
      filteredUsers: signal<User[]>([]),
      filterUsersByType: vi.fn(),
      isLoading: signal(false),
    };

    mockAuthService = {
      hasRole: vi.fn(() => false),
      authState: signal({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }),
    };

    mockLoanStore = {
      isLoading: signal(false),
      getFilteredLoans: vi.fn(() => []),
    };

    await TestBed.configureTestingModule({
      imports: [Shell],
      providers: [
        provideRouter([]),
        { provide: AdminStore, useValue: mockAdminStore },
        { provide: AuthService, useValue: mockAuthService },
        { provide: LoanApplicationStore, useValue: mockLoanStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Shell);
    component = fixture.componentInstance;
    // Don't call detectChanges() here - let individual tests control when to render
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject AdminStore', () => {
    expect(component['store$']).toBe(mockAdminStore);
  });

  it('should inject AuthService', () => {
    expect(component.authService).toBe(mockAuthService);
  });

  describe('userData computed signal', () => {
    it('should transform users to include only email, id, and role', () => {
      const userData = component.userData();

      expect(userData).toEqual([
        {
          email: 'john.doe@example.com',
          id: 'user-001',
          role: 'admin',
        },
        {
          email: 'jane.officer@example.com',
          id: 'user-002',
          role: 'loan-officer',
        },
        {
          email: 'admin@example.com',
          id: 'user-003',
          role: 'admin',
        },
      ]);
    });

    it('should exclude username and fullName from user data', () => {
      const userData = component.userData();

      userData.forEach((user: any) => {
        expect(user.username).toBeUndefined();
        expect(user.fullName).toBeUndefined();
      });
    });

    it('should return empty array when users list is empty', () => {
      mockAdminStore.users.set([]);

      const userData = component.userData();

      expect(userData).toEqual([]);
    });

    it('should handle errors and return empty array', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockAdminStore.users = signal({
        map: () => {
          throw new Error('Test error');
        },
      });

      const userData = component.userData();

      expect(userData).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should reactively update when users change', () => {
      const newUsers: User[] = [
        {
          id: 'user-004',
          firstName: 'new.user',
          email: 'new.user@example.com',
          lastName: 'New User',
          role: 'admin',
          phone: '',
        },
      ];

      mockAdminStore.users.set(newUsers);

      const userData = component.userData();

      expect(userData).toEqual([
        {
          email: 'new.user@example.com',
          id: 'user-004',
          role: 'admin',
        },
      ]);
    });
  });

  describe('template rendering', () => {
    it('should render without errors', () => {
      fixture.detectChanges();

      expect(fixture.nativeElement).toBeTruthy();
    });

    it('should render dashboard component', () => {
      fixture.detectChanges();

      const dashboard = fixture.nativeElement.querySelector('app-dashboard');
      expect(dashboard).toBeTruthy();
    });

    it('should render navigation links to loan application wizard', () => {
      fixture.detectChanges();

      const links = fixture.nativeElement.querySelectorAll('a[routerLink]');
      const wizardLink = Array.from(links).find(
        (link: any) => link.getAttribute('routerLink') === '/loan-application/wizard',
      );

      expect(wizardLink).toBeTruthy();
    });

    it('should render navigation link to underwriting panel', () => {
      fixture.detectChanges();

      const links = fixture.nativeElement.querySelectorAll('a[routerLink]');
      const underwritingLink = Array.from(links).find(
        (link: any) => link.getAttribute('routerLink') === '/underwriting',
      );

      expect(underwritingLink).toBeTruthy();
    });

    it('should show user table when user has loan-officer role', () => {
      mockAuthService.hasRole.mockReturnValue(true);
      fixture.detectChanges();

      const userTable = fixture.nativeElement.querySelector('app-table');
      expect(userTable).toBeTruthy();
    });

    it('should hide user table when user does not have loan-officer role', () => {
      mockAuthService.hasRole.mockReturnValue(false);
      fixture.detectChanges();

      const userTable = fixture.nativeElement.querySelector('app-table');
      expect(userTable).toBeFalsy();
    });

    it('should call hasRole with correct argument', () => {
      fixture.detectChanges();

      expect(mockAuthService.hasRole).toHaveBeenCalledWith('loan-officer');
    });
  });

  describe('integration', () => {
    it('should pass userData to table component when user has loan-officer role', () => {
      mockAuthService.hasRole.mockReturnValue(true);
      fixture.detectChanges();

      const tableElement = fixture.nativeElement.querySelector('app-table');
      expect(tableElement).toBeTruthy();
    });

    it('should handle multiple cards rendering', () => {
      fixture.detectChanges();

      const cards = fixture.nativeElement.querySelectorAll('app-card');
      expect(cards.length).toBeGreaterThan(0);
    });

    it('should maintain shell structure with rows', () => {
      fixture.detectChanges();

      const rows = fixture.nativeElement.querySelectorAll('.row');
      expect(rows.length).toBeGreaterThanOrEqual(3);
    });
  });
});
