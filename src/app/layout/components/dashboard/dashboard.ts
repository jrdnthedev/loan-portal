import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';
import { Card } from '../../../shared/components/card/card';
import { PendingApplication } from '../../../domains/loan-application/components/pending-application/pending-application';
import { LoanOfficer } from '../../../domains/loan-application/components/loan-officer/loan-officer';
import { LoanApplicationStore } from '../../../domains/loan-application/store/loan-application.store';
import { Loan } from '../../../domains/loan-application/models/loan';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, Card, PendingApplication, LoanOfficer],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly loanStore = inject(LoanApplicationStore);

  // Get the last 3 loans for the pending applications display
  recentLoans$ = this.loanStore.userLoans$.pipe(
    map((loans: Loan[]) => loans.slice(Math.max(0, loans.length - 3))),
  );
}
