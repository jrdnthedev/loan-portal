import { Loan } from '../models/loan';
import { LoanType } from '../models/loan-type';
import { LoanStatus } from '../models/loan-status';

export interface LoanApplicationState {
  // Current loan being worked on
  currentLoan: Partial<Loan> | null;

  // User's loan applications
  userLoans: Loan[];

  // UI State
  isLoading: boolean;
  error: string | null;

  // Form state
  selectedLoanType: LoanType;
  formStep: number;
  isDraftSaved: boolean;

  // Application flow state
  isSubmitting: boolean;
  lastSavedAt: Date | null;

  // Filters and search
  statusFilter: LoanStatus | 'all';
  searchQuery: string;
}

export const initialLoanApplicationState: LoanApplicationState = {
  currentLoan: null,
  userLoans: [],
  isLoading: false,
  error: null,
  selectedLoanType: LoanType.Personal,
  formStep: 0,
  isDraftSaved: false,
  isSubmitting: false,
  lastSavedAt: null,
  statusFilter: 'all',
  searchQuery: '',
};
