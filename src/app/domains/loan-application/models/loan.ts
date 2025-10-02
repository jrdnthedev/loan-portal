import { Applicant } from './applicant';
import { LoanAmount } from './loan-amount';
import { LoanStatus } from './loan-status';
import { LoanType } from './loan-type';

export interface Loan {
  id: string;
  type: LoanType;
  amount: LoanAmount;
  termMonths: number;
  applicant: Applicant;
  coSigner?: Applicant;
  status: LoanStatus;
  submittedAt?: string;
}
