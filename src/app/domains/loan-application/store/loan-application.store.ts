import { Injectable, signal, computed } from '@angular/core';
import { Observable, map } from 'rxjs';
import { LoanApplicationState, initialLoanApplicationState } from './loan-application.state';
import { Loan } from '../models/loan';
import { LoanType } from '../models/loan-type';
import { LoanStatus } from '../models/loan-status';
import { LoanApiService } from '../services/loan-api.service';

@Injectable({
  providedIn: 'root',
})
export class LoanApplicationStore {
  // Private state signal
  private readonly _state = signal<LoanApplicationState>(initialLoanApplicationState);

  // Public state signal (readonly)
  public readonly state = this._state.asReadonly();

  // Computed selectors - expose specific parts of state
  public readonly currentLoan = computed(() => this._state().currentLoan);
  public readonly submittedLoan = computed(() => this._state().submittedLoan);
  public readonly userLoans = computed(() => this._state().userLoans);
  public readonly isLoading = computed(() => this._state().isLoading);
  public readonly error = computed(() => this._state().error);
  public readonly selectedLoanType = computed(() => this._state().selectedLoanType);
  public readonly formStep = computed(() => this._state().formStep);
  public readonly isDraftSaved = computed(() => this._state().isDraftSaved);
  public readonly isSubmitting = computed(() => this._state().isSubmitting);
  public readonly lastSavedAt = computed(() => this._state().lastSavedAt);

  // Computed selectors with logic
  public readonly filteredLoans = computed(() => {
    const loans = this._state().userLoans;
    const statusFilter = this._state().statusFilter;
    const searchQuery = this._state().searchQuery;

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
  });

  public readonly canProceedToNextStep = computed(() => {
    const currentLoan = this._state().currentLoan;
    const step = this._state().formStep;

    // Add your business logic for determining if user can proceed
    if (!currentLoan) return false;

    switch (step) {
      case 0: // Loan type selection
        return !!currentLoan.type;
      case 1: // Basic info
        return !!(currentLoan.requestedAmount && currentLoan.termMonths);
      case 2: // Applicant info
        return !!(currentLoan.applicant?.fullName && currentLoan.applicant?.dateOfBirth);
      default:
        return true;
    }
  });

  constructor(private loanApiService: LoanApiService) {
    this.loadUserLoans();
  }

  // State update methods
  private updateState(partialState: Partial<LoanApplicationState>): void {
    this._state.update((currentState) => ({ ...currentState, ...partialState }));
  }

  // Actions
  setLoading(isLoading: boolean): void {
    this.updateState({ isLoading });
  }

  setError(error: string | null): void {
    this.updateState({ error });
  }

  setSelectedLoanType(loanType: LoanType): void {
    const currentLoan = this._state().currentLoan ?? {};
    this.updateState({
      currentLoan: {
        ...initialLoanApplicationState.currentLoan,
        ...this._state().currentLoan,
        type: loanType,
      },
    });
  }

  setFormStep(step: number): void {
    this.updateState({ formStep: step });
  }

  updateCurrentLoan(loanData: Partial<Loan>): void {
    const currentLoan = this._state().currentLoan;
    this.updateState({
      currentLoan: { ...currentLoan, ...loanData },
      isDraftSaved: false,
    });
  }

  saveCurrentLoanDraft(): void {
    const currentLoan = this._state().currentLoan;
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
        console.log(loans);
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
    const currentLoan = this._state().currentLoan;
    if (!currentLoan) {
      this.setError('No loan application to submit');
      return;
    }

    // Ensure we have a complete loan object with required fields
    const loanToSubmit: Partial<Loan> = {
      ...currentLoan,
      id: `loan-${Date.now()}`, // Generate a unique ID
      status: 'pending',
    };

    this.updateState({ isSubmitting: true });
    this.setError(null);

    this.loanApiService.submitLoanApplication(loanToSubmit).subscribe({
      next: (submittedLoan) => {
        const updatedLoans = [...this._state().userLoans, submittedLoan];
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

  // Flexible filtering method that can be used by any component
  getFilteredLoans(
    options: {
      status?: LoanStatus | 'all';
      searchQuery?: string;
      limit?: number;
      sortBy?: 'date' | 'amount' | 'status';
      sortOrder?: 'asc' | 'desc';
    } = {},
  ): Loan[] {
    const loans = this._state().userLoans;
    let filtered = [...loans];

    // Filter by status
    if (options.status && options.status !== 'all') {
      filtered = filtered.filter((loan) => loan.status === options.status);
    }

    // Filter by search query
    if (options.searchQuery?.trim()) {
      const query = options.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (loan) =>
          loan.id.toLowerCase().includes(query) ||
          loan.applicant.fullName.toLowerCase().includes(query) ||
          loan.type.toLowerCase().includes(query),
      );
    }

    // Sort loans
    if (options.sortBy) {
      filtered.sort((a, b) => {
        let comparison = 0;
        switch (options.sortBy) {
          case 'date':
            comparison =
              new Date(a.submittedAt || 0).getTime() - new Date(b.submittedAt || 0).getTime();
            break;
          case 'amount':
            comparison = (a.requestedAmount || 0) - (b.requestedAmount || 0);
            break;
          case 'status':
            comparison = a.status.localeCompare(b.status);
            break;
        }
        return options.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    // Limit results
    if (options.limit && options.limit > 0) {
      filtered = filtered.slice(0, options.limit);
    }

    return filtered;
  }

  // Helper method to get current state value
  getCurrentState(): LoanApplicationState {
    return this._state();
  }

  // Method to get specific loan by ID
  getLoanById(id: string): Observable<Loan | undefined> {
    return new Observable((subscriber) => {
      const loan = this.userLoans().find((loan: Loan) => loan.id === id);
      subscriber.next(loan);
      subscriber.complete();
    });
  }
}
