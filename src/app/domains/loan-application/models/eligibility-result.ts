export interface EligibilityResult {
  isEligible: boolean;
  reasons: string[];
  riskFlags?: RiskFlag[];
}

//move to underwriting domain when created
export interface RiskFlag {
  type: RiskType;
  description: string;
}

export enum RiskType {
  LowIncome = 'low_income',
  PoorCredit = 'poor_credit',
  HighDebt = 'high_debt',
  UnstableEmployment = 'unstable_employment',
}
