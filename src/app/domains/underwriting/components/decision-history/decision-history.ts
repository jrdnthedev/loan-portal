import { Component, inject } from '@angular/core';
import { LoanApplicationStore } from '../../../loan-application/store';

@Component({
  selector: 'app-decision-history',
  imports: [],
  templateUrl: './decision-history.html',
  styleUrl: './decision-history.scss',
})
export class DecisionHistory {
  private store = inject(LoanApplicationStore);

  readonly currentLoan$ = this.store.currentLoan$;
  readonly state$ = this.store.state$;

  constructor() {}
}
