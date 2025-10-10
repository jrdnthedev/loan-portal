import { RiskFlag } from '../../underwriting/models/risk-flag';

export interface EligibilityResult {
  isEligible: boolean;
  reasons: string[];
  riskFlags?: RiskFlag[];
}
