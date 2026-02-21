import { Applicant } from './applicant';
import { LoanStatus } from './loan-status';
import { LoanType } from './loan-type';

export interface Loan {
  id: string;
  type: LoanType;
  requestedAmount: number;
  approved?: number;
  currency?: string;
  termMonths: number;
  applicant: Applicant;
  coSigner?: Applicant;
  status: LoanStatus;
  submittedAt?: string;
}
