import type { PpeMarkups } from '../prices/ppe-markups';

export interface PpeRuleValues {
  code: string;
  markups: PpeMarkups;
  source: string;
  sourceDate: string;
}
