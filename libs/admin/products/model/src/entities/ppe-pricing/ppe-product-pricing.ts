import type { PpeOfferVersion } from './ppe-offer-version';
import type { PpePriceTiers } from './ppe-price-tiers';
import type { PpeRuleVersion } from './ppe-rule-version';

export interface PpeProductPricing {
  productId: number;
  isEnrolled: boolean;
  offer: PpeOfferVersion | null;
  rule: PpeRuleVersion | null;
  prices: PpePriceTiers | null;
  blockers: string[];
}
