import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map, distinctUntilChanged } from 'rxjs';
import { LoanApplicationState, initialLoanApplicationState } from './loan-application.state';
import { Loan } from '../models/loan';
import { LoanType } from '../models/loan-type';
import { LoanStatus } from '../models/loan-status';
import { LoanApiService } from '../services/loan-api.service';

@Injectable({
  providedIn: 'root',
})
export class LoanApplicationStore {
  // Private state subject
  private readonly _state$ = new BehaviorSubject<LoanApplicationState>(initialLoanApplicationState);

  // Public state observable
  public readonly state$ = this._state$.asObservable();

  // Selectors - expose specific parts of state
  public readonly currentLoan$ = this.select((state) => state.currentLoan);
  public readonly submittedLoan$ = this.select((state) => state.submittedLoan);
  public readonly userLoans$ = this.select((state) => state.userLoans);
  public readonly isLoading$ = this.select((state) => state.isLoading);
  public readonly error$ = this.select((state) => state.error);
  public readonly selectedLoanType$ = this.select((state) => state.selectedLoanType);
  public readonly formStep$ = this.select((state) => state.formStep);
  public readonly isDraftSaved$ = this.select((state) => state.isDraftSaved);
  public readonly isSubmitting$ = this.select((state) => state.isSubmitting);
  public readonly lastSavedAt$ = this.select((state) => state.lastSavedAt);

  // Computed selectors
  public readonly filteredLoans$ = combineLatest([
    this.userLoans$,
    this.select((state) => state.statusFilter),
    this.select((state) => state.searchQuery),
  ]).pipe(
    map(([loans, statusFilter, searchQuery]) => {
      let filtered = loans;

      // Filter by status
      if (statusFilter !== 'all') {
        filtered = filtered.filter((loan) => loan.status === statusFilter);
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (loan) =>
            loan.id.toLowerCase().includes(query) ||
            loan.applicant.fullName.toLowerCase().includes(query) ||
            loan.type.toLowerCase().includes(query),
        );
      }

      return filtered;
    }),
  );

  public readonly canProceedToNextStep$ = combineLatest([this.currentLoan$, this.formStep$]).pipe(
    map(([currentLoan, step]) => {
      // Add your business logic for determining if user can proceed
      if (!currentLoan) return false;

      switch (step) {
        case 0: // Loan type selection
          return !!currentLoan.type;
        case 1: // Basic info
          return !!(currentLoan.amount?.requested && currentLoan.termMonths);
        case 2: // Applicant info
          return !!(currentLoan.applicant?.fullName && currentLoan.applicant?.dateOfBirth);
        default:
          return true;
      }
    }),
  );

  constructor(private loanApiService: LoanApiService) {}

  // State update methods
  private updateState(partialState: Partial<LoanApplicationState>): void {
    const currentState = this._state$.value;
    this._state$.next({ ...currentState, ...partialState });
  }

  private select<T>(selector: (state: LoanApplicationState) => T): Observable<T> {
    return this.state$.pipe(map(selector), distinctUntilChanged());
  }

  // Actions
  setLoading(isLoading: boolean): void {
    this.updateState({ isLoading });
  }

  setError(error: string | null): void {
    this.updateState({ error });
  }

  setSelectedLoanType(loanType: LoanType): void {
    const currentLoan = this._state$.value.currentLoan ?? {};
    this.updateState({
      currentLoan: {
        ...initialLoanApplicationState.currentLoan,
        ...this._state$.value.currentLoan,
        type: loanType,
      },
    });
  }

  setFormStep(step: number): void {
    this.updateState({ formStep: step });
  }

  updateCurrentLoan(loanData: Partial<Loan>): void {
    const currentLoan = this._state$.value.currentLoan;
    this.updateState({
      currentLoan: { ...currentLoan, ...loanData },
      isDraftSaved: false,
    });
  }

  saveCurrentLoanDraft(): void {
    const currentLoan = this._state$.value.currentLoan;
    if (currentLoan) {
      // Here you could call API to save draft
      this.updateState({
        isDraftSaved: true,
        lastSavedAt: new Date(),
      });
    }
  }

  loadUserLoans(): void {
    this.setLoading(true);
    this.setError(null);

    this.loanApiService.getLoans().subscribe({
      next: (loans: Loan[]) => {
        this.updateState({
          userLoans: loans,
          isLoading: false,
        });
      },
      error: (error) => {
        this.setError('Failed to load loans');
        this.setLoading(false);
        console.error('Error loading loans:', error);
      },
    });
  }

  submitLoanApplication(): void {
    const currentLoan = this._state$.value.currentLoan;
    if (!currentLoan) {
      this.setError('No loan application to submit');
      return;
    }

    // Ensure we have a complete loan object with required fields
    const loanToSubmit: Partial<Loan> = {
      ...currentLoan,
      id: `loan-${Date.now()}`, // Generate a unique ID
      status: LoanStatus.Pending,
    };

    this.updateState({ isSubmitting: true });
    this.setError(null);

    this.loanApiService.submitLoanApplication(loanToSubmit).subscribe({
      next: (submittedLoan) => {
        const updatedLoans = [...this._state$.value.userLoans, submittedLoan];
        this.updateState({
          userLoans: updatedLoans,
          currentLoan: null, // Clear current loan after submission
          submittedLoan: submittedLoan, // Store submitted loan for summary
          isSubmitting: false,
          formStep: 0,
          isDraftSaved: false,
          lastSavedAt: null,
        });
        console.log('Loan application submitted successfully:', submittedLoan);
      },
      error: (error) => {
        this.setError('Failed to submit loan application');
        this.updateState({ isSubmitting: false });
        console.error('Error submitting loan:', error);
      },
    });
  }

  resetCurrentLoan(): void {
    this.updateState({
      currentLoan: null,
      submittedLoan: null,
      formStep: 0,
      isDraftSaved: false,
      lastSavedAt: null,
    });
  }

  setStatusFilter(status: LoanStatus | 'all'): void {
    this.updateState({ statusFilter: status });
  }

  setSearchQuery(query: string): void {
    this.updateState({ searchQuery: query });
  }

  // Helper method to get current state value
  getCurrentState(): LoanApplicationState {
    return this._state$.value;
  }

  // Method to get specific loan by ID
  getLoanById(id: string): Observable<Loan | undefined> {
    return this.userLoans$.pipe(map((loans) => loans.find((loan) => loan.id === id)));
  }
}
