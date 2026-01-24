import { Component, inject, computed } from '@angular/core';
import { Card } from '../../../shared/components/card/card';
import { PendingApplication } from '../../../domains/loan-application/components/pending-application/pending-application';
import { LoanOfficer } from '../../../domains/loan-application/components/loan-officer/loan-officer';
import { LoanApplicationStore } from '../../../domains/loan-application/store/loan-application.store';
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
  // Get the last 3 pending loans for the pending applications display
  recentLoans = computed(() => {
    return this.loanStore.getFilteredLoans({
      status: 'pending',
      limit: 3,
      sortBy: 'date',
      sortOrder: 'desc',
    });
  });
  filteredUsers = this.adminStore.filteredUsers;

  ngOnInit() {
    this.adminStore.filterUsersByType('loan-officer');
  }
}
