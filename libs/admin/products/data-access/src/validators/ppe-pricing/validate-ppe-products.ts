import { validatePpeOffer } from './validate-ppe-offer';
import { validatePpeRule } from './validate-ppe-rule';
import {
  ensurePricing,
  pricingId,
  pricingRecord,
  validPricingTiers,
} from '../pricing/pricing-values';

import type { PpeProductsDto } from '../../contracts/ppe-pricing/ppe-products.dto';

export function validatePpeProducts(value: unknown, productIds: readonly number[]): PpeProductsDto {
  ensurePricing(Array.isArray(value));
  const ids = new Set<number>();
  for (const item of value) {
    const row = pricingRecord(item);
    const calc = pricingRecord(row['calculation']);
    ensurePricing(
      pricingId(row['productId']) &&
        productIds.includes(row['productId']) &&
        !ids.has(row['productId']) &&
        typeof row['isEnrolled'] === 'boolean' &&
        row['isEnrolled'] === (row['offer'] !== null),
    );
    ids.add(row['productId'] as number);
    const offer = row['offer'] === null ? null : validatePpeOffer(row['offer']);
    const rule = row['rule'] === null ? null : validatePpeRule(row['rule']);
    ensurePricing(calc['isCalculated'] !== true || offer?.isApproved === true);
    ensurePricing(
      (!offer || offer.productId === row['productId']) &&
        (!rule || rule.values.code === offer?.values.ruleCode),
    );
    ensurePricing(
      Array.isArray(calc['blockers']) &&
        calc['blockers'].every((x: unknown) => typeof pricingRecord(x)['code'] === 'string'),
    );
    ensurePricing(
      calc['isCalculated'] === true
        ? validPricingTiers(calc['prices']) && calc['blockers'].length === 0
        : calc['isCalculated'] === false && calc['prices'] === null && calc['blockers'].length > 0,
    );
  }
  return value as PpeProductsDto;
}
