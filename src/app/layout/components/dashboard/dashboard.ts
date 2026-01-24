import { Component, inject } from '@angular/core';
import { map } from 'rxjs';
import { Card } from '../../../shared/components/card/card';
import { PendingApplication } from '../../../domains/loan-application/components/pending-application/pending-application';
import { LoanOfficer } from '../../../domains/loan-application/components/loan-officer/loan-officer';
import { LoanApplicationStore } from '../../../domains/loan-application/store/loan-application.store';
import { Loan } from '../../../domains/loan-application/models/loan';
import { AdminStore } from '../../../domains/admin/store/admin.store';

@Component({
  selector: 'app-dashboard',
  imports: [Card, PendingApplication, LoanOfficer],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly loanStore = inject(LoanApplicationStore);
  private readonly adminStore = inject(AdminStore);
  // Get the last 3 loans for the pending applications display
  recentLoans$ = this.loanStore.userLoans$.pipe(
    map((loans: Loan[]) => loans.slice(Math.max(0, loans.length - 3))),
  );
  filteredUsers = this.adminStore.filteredUsers;

  ngOnInit() {
    this.adminStore.filterUsersByType('loan-officer');
  }
}
