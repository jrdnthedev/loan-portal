import { Component, inject } from '@angular/core';
import { LoanApplicationStore } from '../../../loan-application/store/loan-application.store';
import { AsyncPipe } from '@angular/common';
import { RiskScoring } from '../../services/risk-scoring';
import { LoanApiService } from '../../../loan-application/services/loan-api.service';

@Component({
  selector: 'app-loan-details',
  imports: [AsyncPipe],
  templateUrl: './loan-details.html',
  styleUrl: './loan-details.scss',
})
export class LoanDetails {
  private store = inject(LoanApplicationStore);
  private riskScoring = inject(RiskScoring);
  private loanService = inject(LoanApiService);
  readonly currentLoan$ = this.store.currentLoan$;
  readonly state$ = this.store.state$;

  ngOnInit() {
    this.currentLoan$.subscribe((data) => console.log('currentLoan', data));
    this.state$.subscribe((data) => console.log('hello state', data));
  }
}
