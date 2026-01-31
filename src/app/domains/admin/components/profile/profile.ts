import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { Card } from '../../../../shared/components/card/card';
import { Badge } from '../../../../shared/components/badge/badge';
import { Button } from '../../../../shared/components/button/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [Card, Badge, Button],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  authService = inject(AuthService);
  private route = inject(Router);

  handleDashboardClick(): void {
    console.log('dashboard button clicked!');
    this.route.navigateByUrl('/shell');
  }
  handleActivityLogClick(): void {
    console.log('activity log button clicked!');
  }
}
