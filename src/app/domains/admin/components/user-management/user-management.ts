import { Component, inject } from '@angular/core';
import { Table } from '../../../../shared/components/table/table';
import { AdminStore } from '../../store/admin.store';
import { catchError, map, of } from 'rxjs';
import { User } from '../../models/user';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-user-management',
  imports: [Table, AsyncPipe],
  templateUrl: './user-management.html',
  styleUrl: './user-management.scss',
})
export class UserManagement {
  private store$ = inject(AdminStore);
  userData$ = this.store$.users$.pipe(
    catchError((err: Error) => {
      console.error(err);
      return of([]);
    }),
    map((users: User[]) =>
      users.map((user: User) => {
        const { profile, email, id, role } = user;
        return {
          email,
          id,
          role,
          ...profile,
        };
      }),
    ),
  );
}
