import { Loan } from '../../loan-application/models/loan';

export interface UnderwritingState {
  queue: Loan[];
  selectedLoanId: string | null;
  // filters: UnderwritingFilter;
  sortOrder: 'asc' | 'desc';
  loading: boolean;
  submittedLoanCount: number;
}

export const initialUnderwritingState: UnderwritingState = {
  queue: [],
  selectedLoanId: null,
  sortOrder: 'asc',
  loading: false,
  submittedLoanCount: 0,
};
