import { Component, inject } from '@angular/core';
import { LoanDetails } from '../loan-details/loan-details';
import { Topbar } from '../../../../shared/components/topbar/topbar';
import { UnderwritingStore } from '../../store/underwriting-store';
import { Card } from '../../../../shared/components/card/card';

@Component({
  selector: 'app-loan-decision',
  imports: [LoanDetails, Topbar, Card],
  templateUrl: './loan-decision.html',
  styleUrl: './loan-decision.scss',
})
export class LoanDecision {
  loan: any = {
    id: 'cmmmnv4kh0002swlmryozx7p6',
    type: 'auto',
    requestedAmount: 20000,
    approvedAmount: 0,
    currency: 'USD',
    termMonths: 12,
    status: 'pending',
    downPayment: 5000,
    submittedAt: '2026-03-11T23:19:20.777Z',
    reviewedAt: '',
    createdAt: '2026-03-11T23:19:20.777Z',
    updatedAt: '2026-03-11T23:19:20.777Z',
    applicantId: 'cmmmnv4jb0000swlmev3lgkd9',
    coSignerId: '',
    applicant: {
      id: 'cmmmnv4jb0000swlmev3lgkd9',
      fullName: 'john stevens',
      dateOfBirth: '2006-02-11',
      ssn: '235-52-5648',
      income: 80000,
      employmentStatus: 'full-time',
      creditScore: 850,
      createdAt: '2026-03-11T23:19:20.663Z',
      updatedAt: '2026-03-11T23:19:20.663Z',
    },
    coSigner: undefined,
    vehicleInfo: {
      id: 'cmmmnv4kh0003swlmaxshzkxp',
      make: 'Lexus',
      model: 'ES300',
      year: 2003,
      vin: '12345678987654321',
      mileage: 0,
      value: 100000,
      loanId: 'cmmmnv4kh0002swlmryozx7p6',
    },
    loanType: {
      id: 'auto',
      name: 'Auto Loan',
      description: 'Secured loan for vehicle purchase',
      minAmount: 5000,
      maxAmount: 100000,
      minTerm: 24,
      maxTerm: 84,
      interestRate: 4.5,
    },
  };
  private store = inject(UnderwritingStore);
  readonly riskProfile = this.store.evaluateLoanRisk(this.loan);
}
