import { RiskFlag } from './risk-flag';

export interface RiskProfile {
  score: number; // 0–100
  flags: RiskFlag[];
  riskLevel: 'low' | 'moderate' | 'high';
  explanation: string[];
}
