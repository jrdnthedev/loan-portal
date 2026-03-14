import { computed, Injectable, signal } from '@angular/core';
import { catchError } from 'rxjs';
import { initialUnderwritingState, UnderwritingState } from './underwriting-state';
import { LoanApiService } from '../../loan-application/services/loan-api.service';
import { RiskScoring } from '../services/risk-scoring';
import { Loan } from '../../loan-application/models/loan';

@Injectable({
  providedIn: 'root',
})
export class UnderwritingStore {
  // State signal
  private readonly _state = signal<UnderwritingState>(initialUnderwritingState);

  // Public read-only state
  public readonly state = this._state.asReadonly();

  // Computed signals - expose specific parts of state
  public readonly loading = computed(() => this._state().loading);
  public readonly queue = computed(() => this._state().queue);
  public readonly selectedLoanId = computed(() => this._state().selectedLoanId);
  public readonly sortOrder = computed(() => this._state().sortOrder);
  public readonly submittedLoanCount = computed(() => this._state().submittedLoanCount);
  constructor(
    private loanApiService: LoanApiService,
    private riskScoringService: RiskScoring,
  ) {
    this.loadSubmittedLoans();
  }

  // State update methods
  private updateState(partialState: Partial<UnderwritingState>): void {
    this._state.update((currentState) => ({ ...currentState, ...partialState }));
  }

  //Actions
  loadSubmittedLoans() {
    this.loanApiService
      .getLoans()
      .pipe(
        catchError((err: Error) => {
          console.error('Error loading loans:', err);
          return [];
        }),
      )
      .subscribe({
        next: (data: Loan[]) => {
          this.updateState({ queue: data, submittedLoanCount: data.length });
        },
      });
  }

  selectLoanForReview() {}

  applyUnderwritingFilters() {}

  markLoanAsReviewed() {}

  prioritizeLoan() {}
}
