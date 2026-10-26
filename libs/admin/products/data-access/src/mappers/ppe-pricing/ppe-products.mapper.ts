import { mapPpeOffer } from './ppe-offer.mapper';
import { mapPpeRule } from './ppe-rule.mapper';
import { validatePpeProducts } from '../../validators/ppe-pricing/validate-ppe-products';

import type { PpeProductPricing } from '@admin/products/model';

export function mapPpeProducts(value: unknown, ids: readonly number[]): PpeProductPricing[] {
  return validatePpeProducts(value, ids).map((row) => ({
    productId: row.productId,
    isEnrolled: row.isEnrolled,
    offer: row.offer ? mapPpeOffer(row.offer, row.productId) : null,
    rule: row.rule ? mapPpeRule(row.rule, row.rule.values.code) : null,
    prices: row.calculation.prices
      ? {
          retail: row.calculation.prices.retail,
          wholesale: row.calculation.prices.wholesale,
          largeWholesale: row.calculation.prices.largeWholesale,
        }
      : null,
    blockers: row.calculation.blockers.map((x) => x.code),
  }));
}
