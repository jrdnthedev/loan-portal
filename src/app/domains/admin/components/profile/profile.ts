import { Component, inject, signal, computed, effect } from '@angular/core';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { Card } from '../../../../shared/components/card/card';
import { Badge } from '../../../../shared/components/badge/badge';
import { Button } from '../../../../shared/components/button/button';
import { Router } from '@angular/router';
import { FormInput } from '../../../../shared/components/form-input/form-input';
import { form, FormField } from '@angular/forms/signals';
import { UserService } from '../../services/user-service';
import { AdminStore } from '../../store/admin.store';

interface LoginData {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  role: string;
  id: string;
}

@Component({
  selector: 'app-profile',
  imports: [Card, Badge, Button, FormInput, FormField],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  authService = inject(AuthService);
  userService = inject(UserService);
  adminStore = inject(AdminStore);
  private route = inject(Router);
  user = computed(() => this.authService.authState().user);

  profileModel = signal<LoginData>({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    role: '',
    id: '',
  });

  loginForm = form(this.profileModel);

  constructor() {
    // Update profileModel whenever user changes
    effect(() => {
      const currentUser = this.user();
      if (currentUser) {
        this.profileModel.set({
          firstname: currentUser.firstName || '',
          lastname: currentUser.lastName || '',
          email: currentUser.email || '',
          phone: currentUser.phone || '1234567',
          role: currentUser.role || '',
          id: currentUser.id || '',
        });
      }
    });
  }

  handleDashboardClick(): void {
    this.route.navigateByUrl('/shell');
  }

  handleActivityLogClick(): void {
    console.log('activity log button clicked!');
  }

  resetInformation(): void {
    const currentUser = this.user();
    if (currentUser) {
      this.profileModel.set({
        firstname: currentUser.firstName || '',
        lastname: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '1234567',
        role: currentUser.role || '',
        id: currentUser.id || '',
      });
    }
  }

  updateInformation(): void {
    const currentUser = this.user();
    if (currentUser && currentUser.id) {
      const updatedUser = {
        ...currentUser,
        firstName: this.loginForm.firstname().value(),
        lastName: this.loginForm.lastname().value(),
        email: this.loginForm.email().value(),
        phone: this.loginForm.phone().value(),
      };

      this.userService.updateUser(this.user()!.id, updatedUser).subscribe({
        next: (updatedUserResponse) => {
          // Update the auth state with the new user information
          this.authService.updateUser(updatedUserResponse);

          // Reload users in the admin store to reflect the changes
          this.adminStore.loadUsers();

          // Log the admin action
          this.adminStore.logUserManagementAction(
            this.user()!.id,
            'UPDATE_PROFILE',
            this.user()!.id,
          );

          console.log('Information updated successfully!');
        },
        error: (error) => {
          console.error('Error updating user information:', error);
        },
      });
    }
  }
}
