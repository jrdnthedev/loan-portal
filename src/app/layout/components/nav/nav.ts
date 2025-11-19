import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core';
import { Login } from '../../../core/auth/components/login/login';
import { Register } from '../../../core/auth/components/register/register';
import { Modal } from '../../../shared/components/modal/modal';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, Login, Register, Modal],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav {
  isMenuOpen = signal(false);
  authService = inject(AuthService);
  isLoginModalOpen = signal(false);
  isRegisterModalOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update((isOpen) => !isOpen);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  toggleLogin() {
    this.isLoginModalOpen.update((value) => !value);
  }

  toggleRegister() {
    this.isRegisterModalOpen.update((value) => !value);
  }
}
