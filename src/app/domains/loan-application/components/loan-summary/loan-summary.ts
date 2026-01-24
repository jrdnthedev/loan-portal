import { Component, inject, signal } from '@angular/core';
import { LoanApplicationStore } from '../../store/loan-application.store';

@Component({
  selector: 'app-loan-summary',
  imports: [],
  templateUrl: './loan-summary.html',
  styleUrl: './loan-summary.scss',
})
export class LoanSummary {
  protected readonly main_header = signal('Loan Summary');
  private store = inject(LoanApplicationStore);

  // Expose store signals for the template
  readonly currentLoan = this.store.currentLoan;
  readonly submittedLoan = this.store.submittedLoan;
  readonly state = this.store.state;
}
