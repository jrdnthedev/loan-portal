import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { EMPTY } from 'rxjs';

import { Nav } from './nav';
import { AuthService } from '../../../core';

describe('Nav', () => {
  let component: Nav;
  let fixture: ComponentFixture<Nav>;
  let authService: any;

  beforeEach(async () => {
    authService = {
      authState: signal({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }),
      hasRole: vi.fn(() => false),
      logout: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Nav],
      providers: [provideRouter([]), { provide: AuthService, useValue: authService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Nav);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Menu Toggle', () => {
    it('should initialize with menu closed', () => {
      expect(component.isMenuOpen()).toBe(false);
    });

    it('should toggle menu state', () => {
      expect(component.isMenuOpen()).toBe(false);
      component.toggleMenu();
      expect(component.isMenuOpen()).toBe(true);
      component.toggleMenu();
      expect(component.isMenuOpen()).toBe(false);
    });

    it('should close menu', () => {
      component.isMenuOpen.set(true);
      component.closeMenu();
      expect(component.isMenuOpen()).toBe(false);
    });
  });

  describe('Modal Management', () => {
    it('should initialize with modals closed', () => {
      expect(component.isLoginModalOpen()).toBe(false);
      expect(component.isRegisterModalOpen()).toBe(false);
    });

    it('should open login modal', () => {
      component.openLogin();
      expect(component.isLoginModalOpen()).toBe(true);
    });

    it('should close login modal', () => {
      component.isLoginModalOpen.set(true);
      component.closeLogin();
      expect(component.isLoginModalOpen()).toBe(false);
    });

    it('should open register modal', () => {
      component.openRegister();
      expect(component.isRegisterModalOpen()).toBe(true);
    });

    it('should close register modal', () => {
      component.isRegisterModalOpen.set(true);
      component.closeRegister();
      expect(component.isRegisterModalOpen()).toBe(false);
    });
  });

  describe('Home Route', () => {
    it('should return "/" when user is not authenticated', () => {
      authService.authState.set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      expect(component.homeRoute()).toBe('/');
    });

    it('should return "/shell" when user is authenticated', () => {
      authService.authState.set({
        user: { id: '1', firstName: 'John' },
        isAuthenticated: true,
        isLoading: false,
      });
      expect(component.homeRoute()).toBe('/shell');
    });
  });

  describe('Navigation Items', () => {
    it('should show Login and Register for unauthenticated users', () => {
      authService.authState.set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      const items = component.navItems();
      expect(items.length).toBe(2);
      expect(items[0].label).toBe('Login');
      expect(items[1].label).toBe('Register');
    });

    it('should show customer-specific items for customer role', () => {
      authService.authState.set({
        user: { id: '1', firstName: 'John', role: 'customer' },
        isAuthenticated: true,
        isLoading: false,
      });
      authService.hasRole.mockImplementation((role: string) => role === 'customer');

      const items = component.navItems();
      const wizardItem = items.find((item) => item.label === 'Loan Application Wizard');
      expect(wizardItem).toBeTruthy();
      expect(wizardItem?.route).toBe('/loan-application/wizard');
    });

    it('should show loan officer-specific items for loan-officer role', () => {
      authService.authState.set({
        user: { id: '1', firstName: 'Jane', role: 'loan-officer' },
        isAuthenticated: true,
        isLoading: false,
      });
      authService.hasRole.mockImplementation((role: string) => role === 'loan-officer');

      const items = component.navItems();
      const underwritingItem = items.find((item) => item.label === 'Underwriting Panel');
      const adminItem = items.find((item) => item.label === 'Admin');

      expect(underwritingItem).toBeTruthy();
      expect(underwritingItem?.route).toBe('/underwriting');
      expect(adminItem).toBeTruthy();
      expect(adminItem?.route).toBe('/admin');
    });

    it('should show Profile and Logout for authenticated users', () => {
      authService.authState.set({
        user: { id: '1', firstName: 'John', role: 'customer' },
        isAuthenticated: true,
        isLoading: false,
      });
      authService.hasRole.mockImplementation((role: string) => role === 'customer');

      const items = component.navItems();
      const profileItem = items.find((item) => item.label === 'Profile');
      const logoutItem = items.find((item) => item.label?.includes('Logout'));

      expect(profileItem).toBeTruthy();
      expect(profileItem?.route).toBe('admin/profile');
      expect(logoutItem).toBeTruthy();
      expect(logoutItem?.label).toBe('Logout, John');
    });

    it('should call logout and close menu when logout action is invoked', () => {
      authService.authState.set({
        user: { id: '1', firstName: 'John', role: 'customer' },
        isAuthenticated: true,
        isLoading: false,
      });
      authService.hasRole.mockImplementation((role: string) => role === 'customer');
      component.isMenuOpen.set(true);

      const items = component.navItems();
      const logoutItem = items.find((item) => item.label?.includes('Logout'));

      logoutItem?.action?.();

      expect(authService.logout).toHaveBeenCalled();
      expect(component.isMenuOpen()).toBe(false);
    });

    it('should open login modal and close menu when login action is invoked', () => {
      authService.authState.set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      component.isMenuOpen.set(true);

      const items = component.navItems();
      const loginItem = items.find((item) => item.label === 'Login');

      loginItem?.action?.();

      expect(component.isLoginModalOpen()).toBe(true);
      expect(component.isMenuOpen()).toBe(false);
    });

    it('should open register modal and close menu when register action is invoked', () => {
      authService.authState.set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      component.isMenuOpen.set(true);

      const items = component.navItems();
      const registerItem = items.find((item) => item.label === 'Register');

      registerItem?.action?.();

      expect(component.isRegisterModalOpen()).toBe(true);
      expect(component.isMenuOpen()).toBe(false);
    });
  });
});
