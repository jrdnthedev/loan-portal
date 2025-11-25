import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core';
import { Login } from '../../../core/auth/components/login/login';
import { Register } from '../../../core/auth/components/register/register';
import { Modal } from '../../../shared/components/modal/modal';

interface NavItem {
  label: string;
  route?: string;
  action?: () => void;
  requiresAuth?: boolean;
  roles?: string[];
}

@Component({
  selector: 'app-nav',
  imports: [RouterLink, Login, Register, Modal],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav {
  isMenuOpen = signal<boolean>(false);
  private authService = inject(AuthService);
  isLoginModalOpen = signal<boolean>(false);
  isRegisterModalOpen = signal<boolean>(false);
  homeRoute = computed(() => {
    let route = '';
    if (this.authService.authState().isAuthenticated) {
      route = '/shell';
    } else {
      route = '/';
    }
    return route;
  });

  // Computed signal for navigation items based on user roles
  navItems = computed(() => {
    const authState = this.authService.authState();
    const items: NavItem[] = [];

    if (authState.isAuthenticated) {
      // Customer-specific items
      if (this.authService.hasRole('customer')) {
        items.push({
          label: 'Loan Application Wizard',
          route: '/loan-application/wizard',
        });
      }

      // Loan Officer-specific items
      if (this.authService.hasRole('loan-officer')) {
        items.push(
          {
            label: 'Underwriting Panel',
            route: '/underwriting',
          },
          {
            label: 'Admin',
            route: '/admin',
          },
        );
      }

      // Logout item (always visible when authenticated)
      items.push({
        label: `Logout, ${authState.user?.firstName}`,
        action: () => {
          this.closeMenu();
          this.authService.logout();
        },
      });
    } else {
      // Unauthenticated items
      items.push(
        {
          label: 'Login',
          action: () => this.openLogin(),
        },
        {
          label: 'Register',
          action: () => this.openRegister(),
        },
      );
    }

    return items;
  });

  toggleMenu() {
    this.isMenuOpen.update((isOpen: boolean) => !isOpen);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  openLogin() {
    this.isLoginModalOpen.set(true);
  }

  closeLogin() {
    this.isLoginModalOpen.set(false);
  }

  openRegister() {
    this.isRegisterModalOpen.set(true);
  }

  closeRegister() {
    this.isRegisterModalOpen.set(false);
  }
}
