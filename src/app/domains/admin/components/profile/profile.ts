import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { Card } from '../../../../shared/components/card/card';

@Component({
  selector: 'app-profile',
  imports: [Card],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  authService = inject(AuthService);
}
