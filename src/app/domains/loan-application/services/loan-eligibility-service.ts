import { Injectable } from '@angular/core';
import { EligibilityResult } from '../models/eligibility-result';
import { Loan } from '../models/loan';
import { EmploymentStatus } from '../models/employment-status.enum';

@Injectable({
  providedIn: 'root',
})
export class LoanEligibilityService {
  checkEligibility(loan: Loan): EligibilityResult {
    const reasons: string[] = [];

    if (loan.applicant.income < 25000) {
      reasons.push('Income below minimum threshold');
    }

    if (loan.applicant.employmentStatus === EmploymentStatus.Unemployed) {
      reasons.push('Applicant must be employed');
    }

    if (loan.amount.requested > 100000) {
      reasons.push('Loan amount exceeds limit');
    }

    return {
      isEligible: reasons.length === 0,
      reasons,
    };
  }
}
