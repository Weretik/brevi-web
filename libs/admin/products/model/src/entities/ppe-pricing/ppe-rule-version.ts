import type { PpeRuleValues } from './ppe-rule-values';

export interface PpeRuleVersion {
  id: string;
  values: PpeRuleValues;
  isApproved: boolean;
  approvedAt: string | null;
}
