import { Component, inject } from '@angular/core';
import { Table } from '../../../../shared/components/table/table';
import { AdminStore } from '../../store/admin.store';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-management',
  imports: [Table],
  templateUrl: './user-management.html',
  styleUrl: './user-management.scss',
})
export class UserManagement {
  private store = inject(AdminStore);
  readonly userData = this.store.users;
}
