import { Injectable } from '@angular/core';
import { RiskProfile } from '../models/risk-profile';
import { Loan } from '../../loan-application/models/loan';
import { RiskFlag } from '../models/risk-flag';
import { RiskType } from '../models/riskt-type';

@Injectable({
  providedIn: 'root',
})
export class RiskScoring {
  evaluate(loan: Loan): RiskProfile {
    let score = 100;
    const flags: RiskFlag[] = [];
    const explanation: string[] = [];

    if (loan.applicant.income < 30000) {
      score -= 20;
      flags.push({ type: RiskType.LowIncome, description: 'Income below $30k' });
      explanation.push('Low income reduces repayment confidence');
    }

    if (loan.applicant.creditScore && loan.applicant.creditScore < 600) {
      score -= 25;
      flags.push({ type: RiskType.PoorCredit, description: 'Credit score below 600' });
      explanation.push('Poor credit history increases default risk');
    }

    const riskLevel = score >= 80 ? 'low' : score >= 60 ? 'moderate' : 'high';

    return { score, flags, riskLevel, explanation };
  }
}
