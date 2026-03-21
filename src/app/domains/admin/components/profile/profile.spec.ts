import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Profile } from './profile';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { UserService } from '../../services/user-service';
import { AdminStore } from '../../store/admin.store';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { of, throwError } from 'rxjs';
import { User } from '../../models/user';

describe('Profile', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;
  let mockAuthService: any;
  let mockUserService: any;
  let mockAdminStore: any;
  let mockRouter: any;

  const mockUser: User = {
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '555-1234',
    role: 'admin',
  };

  beforeEach(async () => {
    mockAuthService = {
      authState: signal({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      }),
      updateUser: vi.fn(),
    };

    mockUserService = {
      updateUser: vi.fn(),
    };

    mockAdminStore = {
      loadUsers: vi.fn(),
      logUserManagementAction: vi.fn(),
    };

    mockRouter = {
      navigateByUrl: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
        { provide: AdminStore, useValue: mockAdminStore },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with user data from auth service', () => {
      expect(component.profileModel().firstname).toBe('John');
      expect(component.profileModel().lastname).toBe('Doe');
      expect(component.profileModel().email).toBe('john@example.com');
      expect(component.profileModel().phone).toBe('555-1234');
      expect(component.profileModel().role).toBe('admin');
      expect(component.profileModel().id).toBe('123');
    });

    it('should have user computed signal returning current user', () => {
      const user = component.user();
      expect(user).toEqual(mockUser);
    });

    it('should handle user with missing optional fields', () => {
      mockAuthService.authState.set({
        user: {
          id: '456',
          firstName: null,
          lastName: null,
          email: 'test@example.com',
          phone: null,
          role: 'admin',
        },
        isAuthenticated: true,
        isLoading: false,
      });

      fixture = TestBed.createComponent(Profile);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.profileModel().firstname).toBe('');
      expect(component.profileModel().lastname).toBe('');
      expect(component.profileModel().email).toBe('test@example.com');
      expect(component.profileModel().phone).toBe('1234567');
      expect(component.profileModel().role).toBe('admin');
    });
  });

  describe('Navigation Methods', () => {
    it('should navigate to shell on dashboard click', () => {
      component.handleDashboardClick();
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/shell');
    });

    it('should log on activity log click', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      component.handleActivityLogClick();
      expect(consoleSpy).toHaveBeenCalledWith('activity log button clicked!');
      consoleSpy.mockRestore();
    });
  });

  describe('resetInformation', () => {
    it('should reset form data to original user values', () => {
      // Modify the form data
      component.profileModel.set({
        firstname: 'Modified',
        lastname: 'Name',
        email: 'modified@example.com',
        phone: '999-9999',
        role: 'loan-officer',
        id: '123',
      });

      // Verify form was modified
      expect(component.profileModel().firstname).toBe('Modified');
      expect(component.profileModel().lastname).toBe('Name');

      // Reset the form
      component.resetInformation();

      // Verify form is reset to original user data
      expect(component.profileModel().firstname).toBe('John');
      expect(component.profileModel().lastname).toBe('Doe');
      expect(component.profileModel().email).toBe('john@example.com');
      expect(component.profileModel().phone).toBe('555-1234');
      expect(component.profileModel().role).toBe('admin');
    });

    it('should handle reset when user is null', () => {
      mockAuthService.authState.set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      // Should not throw error
      expect(() => component.resetInformation()).not.toThrow();
    });

    it('should use default phone when user phone is missing', () => {
      mockAuthService.authState.set({
        user: {
          ...mockUser,
          phone: null,
        },
        isAuthenticated: true,
        isLoading: false,
      });

      component.resetInformation();

      expect(component.profileModel().phone).toBe('1234567');
    });
  });

  describe('updateInformation', () => {
    const updatedUser: User = {
      ...mockUser,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phone: '555-9999',
    };

    beforeEach(() => {
      // Set up form with modified values
      component.loginForm.firstname().value.set('Jane');
      component.loginForm.lastname().value.set('Smith');
      component.loginForm.email().value.set('jane@example.com');
      component.loginForm.phone().value.set('555-9999');
    });

    it('should update user information successfully', () => {
      mockUserService.updateUser.mockReturnValue(of(updatedUser));
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      component.updateInformation();

      expect(mockUserService.updateUser).toHaveBeenCalledWith('123', {
        ...mockUser,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '555-9999',
      });

      expect(mockAuthService.updateUser).toHaveBeenCalledWith(updatedUser);
      expect(mockAdminStore.loadUsers).toHaveBeenCalled();
      expect(mockAdminStore.logUserManagementAction).toHaveBeenCalledWith(
        '123',
        'UPDATE_PROFILE',
        '123',
      );
      expect(consoleSpy).toHaveBeenCalledWith('Information updated successfully!');

      consoleSpy.mockRestore();
    });

    it('should not call updateUser when user is null', () => {
      mockAuthService.authState.set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      component.updateInformation();

      expect(mockUserService.updateUser).not.toHaveBeenCalled();
      expect(mockAuthService.updateUser).not.toHaveBeenCalled();
      expect(mockAdminStore.loadUsers).not.toHaveBeenCalled();
      expect(mockAdminStore.logUserManagementAction).not.toHaveBeenCalled();
    });

    it('should not call updateUser when user id is missing', () => {
      mockAuthService.authState.set({
        user: { ...mockUser, id: '' },
        isAuthenticated: true,
        isLoading: false,
      });

      component.updateInformation();

      expect(mockUserService.updateUser).not.toHaveBeenCalled();
    });

    it('should handle update error gracefully', () => {
      const errorResponse = { message: 'Update failed' };
      mockUserService.updateUser.mockReturnValue(throwError(() => errorResponse));
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      component.updateInformation();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error updating user information:',
        errorResponse,
      );
      expect(mockAuthService.updateUser).not.toHaveBeenCalled();
      expect(mockAdminStore.loadUsers).not.toHaveBeenCalled();
      expect(mockAdminStore.logUserManagementAction).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should send updated data from form fields', () => {
      mockUserService.updateUser.mockReturnValue(of(updatedUser));

      component.loginForm.firstname().value.set('UpdatedFirst');
      component.loginForm.lastname().value.set('UpdatedLast');
      component.loginForm.email().value.set('updated@example.com');
      component.loginForm.phone().value.set('555-0000');

      component.updateInformation();

      const expectedUser = {
        ...mockUser,
        firstName: 'UpdatedFirst',
        lastName: 'UpdatedLast',
        email: 'updated@example.com',
        phone: '555-0000',
      };

      expect(mockUserService.updateUser).toHaveBeenCalledWith('123', expectedUser);
    });

    it('should preserve role and id when updating', () => {
      mockUserService.updateUser.mockReturnValue(of(updatedUser));

      component.updateInformation();

      const callArgs = mockUserService.updateUser.mock.calls[0][1];
      expect(callArgs.role).toBe('admin');
      expect(callArgs.id).toBe('123');
    });
  });

  describe('User State Reactivity', () => {
    it('should update profile model when user changes in auth service', () => {
      const newUser: User = {
        id: '456',
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice@example.com',
        phone: '555-5555',
        role: 'underwriter',
      };

      mockAuthService.authState.set({
        user: newUser,
        isAuthenticated: true,
        isLoading: false,
      });

      fixture.detectChanges();

      expect(component.profileModel().firstname).toBe('Alice');
      expect(component.profileModel().lastname).toBe('Johnson');
      expect(component.profileModel().email).toBe('alice@example.com');
      expect(component.profileModel().phone).toBe('555-5555');
      expect(component.profileModel().role).toBe('underwriter');
      expect(component.profileModel().id).toBe('456');
    });

    it('should not update profile model when user is null', () => {
      // Set initial user
      expect(component.profileModel().firstname).toBe('John');

      // Set user to null
      mockAuthService.authState.set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      fixture.detectChanges();

      // Profile model should retain previous values
      expect(component.profileModel().firstname).toBe('John');
    });
  });

  describe('Form Integration', () => {
    it('should have loginForm connected to profileModel', () => {
      expect(component.loginForm.firstname().value()).toBe('John');
      expect(component.loginForm.lastname().value()).toBe('Doe');
      expect(component.loginForm.email().value()).toBe('john@example.com');
      expect(component.loginForm.phone().value()).toBe('555-1234');
    });

    it('should update form when profile model changes', () => {
      component.profileModel.set({
        firstname: 'Test',
        lastname: 'User',
        email: 'test@example.com',
        phone: '555-0000',
        role: 'admin',
        id: '789',
      });

      fixture.detectChanges();

      expect(component.loginForm.firstname().value()).toBe('Test');
      expect(component.loginForm.lastname().value()).toBe('User');
      expect(component.loginForm.email().value()).toBe('test@example.com');
      expect(component.loginForm.phone().value()).toBe('555-0000');
    });
  });
});
