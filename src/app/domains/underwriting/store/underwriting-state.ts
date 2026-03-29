import { Loan } from '../../loan-application/models/loan';

export interface UnderwritingState {
  queue: Loan[];
  selectedLoanIds: string[];
  // filters: UnderwritingFilter;
  sortOrder: 'asc' | 'desc';
  loading: boolean;
  submittedLoanCount: number;
}

export const initialUnderwritingState: UnderwritingState = {
  queue: [],
  selectedLoanIds: [],
  sortOrder: 'asc',
  loading: false,
  submittedLoanCount: 0,
};
