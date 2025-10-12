import { Component, inject } from '@angular/core';
import { LoanApplicationStore } from '../../../loan-application/store/loan-application.store';

@Component({
  selector: 'app-loan-details',
  imports: [],
  templateUrl: './loan-details.html',
  styleUrl: './loan-details.scss',
})
export class LoanDetails {
  private store = inject(LoanApplicationStore);

  readonly currentLoan$ = this.store.currentLoan$;
  readonly state$ = this.store.state$;

  ngOnInit() {
    this.currentLoan$.subscribe((data) => console.log('currentLoan', data));
    this.state$.subscribe((data) => console.log('hello state', data));
  }
}
