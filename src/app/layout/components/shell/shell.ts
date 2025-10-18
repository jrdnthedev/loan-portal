import { Component, inject, signal } from '@angular/core';
import { Dashboard } from '../dashboard/dashboard';
import { Card } from '../../../shared/components/card/card';
import { RouterLink } from '@angular/router';
import { Table } from '../../../shared/components/table/table';
import { UserService } from '../../../domains/admin/services/user-service';
import { User } from '../../../domains/admin/models/user';
import { catchError, map } from 'rxjs';

@Component({
  selector: 'app-shell',
  imports: [Dashboard, Card, RouterLink, Table],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  private userService = inject(UserService);
  userData = signal<Partial<User>[]>([]);

  ngOnInit() {
    this.userService
      .getUsers()
      .pipe(
        catchError((err: Error) => {
          console.error(err);
          return [];
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
      )
      .subscribe((users: Partial<User>[]) => {
        this.userData.set(users);
      });
  }
}
