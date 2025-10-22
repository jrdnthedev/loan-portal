import { Component, inject } from '@angular/core';
import { AdminStore } from '../../../admin/store/admin.store';
import { UserRole } from '../../../admin/models/user-role';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-loan-officer',
  imports: [AsyncPipe],
  templateUrl: './loan-officer.html',
  styleUrl: './loan-officer.scss',
})
export class LoanOfficer {
  private store$ = inject(AdminStore);
  filteredUsers$ = this.store$.filteredUsers$;

  ngOnInit() {
    this.store$.filterUsersByType('loan-officer');
  }
}
