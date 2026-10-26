import type { SewingPriceTiers } from './sewing-price-tiers';

export type SewingCostKind =
  | 'materials'
  | 'otherCosts'
  | 'seamstress'
  | 'cutting'
  | 'master'
  | 'manager'
  | 'bonus'
  | 'overhead';

export interface SewingPriceCalculation {
  id: string;
  productId: number;
  articleId: number;
  saleSku: string;
  createdAt: string;
  compositionVersion: number;
  settingsVersionId: number | null;
  settingsRevision: number | null;
  referenceVersionIds: number[];
  calculated: boolean;
  costs: Array<{ kind: SewingCostKind; amount: number }>;
  minutes: number | null;
  minuteCost: number | null;
  fullCost: number | null;
  prices: SewingPriceTiers | null;
  blockers: Array<{ code: string; inputKey: string | null }>;
}
