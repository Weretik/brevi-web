import type { PpePriceTiers } from './ppe-price-tiers';
import type { PpeOfferVersion } from '../offers/ppe-offer-version';
import type { PpeRuleVersion } from '../rules/ppe-rule-version';

export interface PpeProductPricing {
  productId: number;
  isEnrolled: boolean;
  offer: PpeOfferVersion | null;
  rule: PpeRuleVersion | null;
  prices: PpePriceTiers | null;
  blockers: string[];
}
