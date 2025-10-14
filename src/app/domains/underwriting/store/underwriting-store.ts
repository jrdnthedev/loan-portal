import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map, Observable } from 'rxjs';
import { initialUnderwritingState, UnderwritingState } from './underwriting-state';
import { LoanApiService } from '../../loan-application/services/loan-api.service';
import { RiskScoring } from '../services/risk-scoring';

@Injectable({
  providedIn: 'root',
})
export class UnderwritingStore {
  private readonly _state$ = new BehaviorSubject<UnderwritingState>(initialUnderwritingState);

  // Public state observable
  public readonly state$ = this._state$.asObservable();

  // Selectors - expose specific parts of state
  public readonly loading$ = this.select((state) => state.loading);

  constructor(
    private loanApiService: LoanApiService,
    private riskScoringService: RiskScoring,
  ) {}

  // State update methods
  private updateState(partialState: Partial<UnderwritingState>): void {
    const currentState = this._state$.value;
    this._state$.next({ ...currentState, ...partialState });
  }

  private select<T>(selector: (state: UnderwritingState) => T): Observable<T> {
    return this.state$.pipe(map(selector), distinctUntilChanged());
  }

  //Actions
  loadSubmittedLoans() {}

  selectLoanForReview() {}

  applyUnderwritingFilters() {}

  markLoanAsReviewed() {}

  prioritizeLoan() {}
}
