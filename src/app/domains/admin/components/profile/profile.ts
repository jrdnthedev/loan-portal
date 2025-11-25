import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/auth/services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  authService = inject(AuthService);
}
