import { DecisionType } from './decision-type.enum';
import { RiskFlag } from './risk-flag';

export interface UnderwritingDecision {
  id: string;
  loanId: string;
  reviewerId: string;
  decision: DecisionType;
  notes: string;
  riskFlags: RiskFlag[];
  decidedAt: string;
}
