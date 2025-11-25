import { Component, inject, signal } from '@angular/core';
import { Dashboard } from '../dashboard/dashboard';
import { Card } from '../../../shared/components/card/card';
import { RouterLink } from '@angular/router';
import { Table } from '../../../shared/components/table/table';
import { User } from '../../../domains/admin/models/user';
import { catchError, map, of } from 'rxjs';
import { AdminStore } from '../../../domains/admin/store/admin.store';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../../core';

@Component({
  selector: 'app-shell',
  imports: [Dashboard, Card, RouterLink, Table, AsyncPipe],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  private store$ = inject(AdminStore);
  authService = inject(AuthService);
  userData$ = this.store$.users$.pipe(
    catchError((err: Error) => {
      console.error(err);
      return of([]);
    }),
    map((users: User[]) =>
      users.map((user: User) => {
        const { firstName, email, id, role } = user;
        return {
          firstName,
          email,
          id,
          role,
        };
      }),
    ),
  );
}
