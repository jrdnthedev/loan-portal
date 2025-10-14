import { Component, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { LoanApplicationStore } from '../../store/loan-application.store';

@Component({
  selector: 'app-loan-summary',
  imports: [AsyncPipe],
  templateUrl: './loan-summary.html',
  styleUrl: './loan-summary.scss',
})
export class LoanSummary {
  protected readonly main_header = signal('Loan Summary');
  private store = inject(LoanApplicationStore);

  // Expose store observables for the template
  readonly currentLoan$ = this.store.currentLoan$;
  readonly submittedLoan$ = this.store.submittedLoan$;
  readonly state$ = this.store.state$;

  ngOnInit() {
    this.currentLoan$.subscribe((data) => console.log('currentLoan', data));
    this.submittedLoan$.subscribe((data) => console.log('submittedLoan', data));
    this.state$.subscribe((data) => console.log('hello state', data));
  }
}
