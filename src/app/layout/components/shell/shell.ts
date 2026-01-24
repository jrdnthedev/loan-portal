import { Component, inject, signal, computed } from '@angular/core';
import { Dashboard } from '../dashboard/dashboard';
import { Card } from '../../../shared/components/card/card';
import { RouterLink } from '@angular/router';
import { Table } from '../../../shared/components/table/table';
import { User } from '../../../domains/admin/models/user';
import { AdminStore } from '../../../domains/admin/store/admin.store';
import { AuthService } from '../../../core';

@Component({
  selector: 'app-shell',
  imports: [Dashboard, Card, RouterLink, Table],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  private store$ = inject(AdminStore);
  authService = inject(AuthService);
  userData = computed(() => {
    try {
      return this.store$.users().map((user: User) => {
        const { email, id, role } = user;
        return {
          email,
          id,
          role,
        };
      });
    } catch (err) {
      console.error(err);
      return [];
    }
  });
}
