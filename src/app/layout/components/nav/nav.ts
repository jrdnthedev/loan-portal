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
  isMenuOpen = signal<boolean>(false);
  authService = inject(AuthService);
  isLoginModalOpen = signal<boolean>(false);
  isRegisterModalOpen = signal<boolean>(false);

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
