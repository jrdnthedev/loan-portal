import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-loan-summary',
  imports: [],
  templateUrl: './loan-summary.html',
  styleUrl: './loan-summary.scss',
})
export class LoanSummary {
  protected readonly main_header = signal('Loan Summary');
}
