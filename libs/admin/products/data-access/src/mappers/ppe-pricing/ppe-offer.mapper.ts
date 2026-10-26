import { validatePpeOffer } from '../../validators/ppe-pricing/validate-ppe-offer';
import { ensurePricing } from '../../validators/pricing/pricing-values';

import type { PpeOfferVersion } from '@admin/products/model';

export function mapPpeOffer(value: unknown, productId: number): PpeOfferVersion {
  const row = validatePpeOffer(value);
  ensurePricing(row.productId === productId);
  return {
    id: row.id,
    productId: row.productId,
    isApproved: row.isApproved,
    approvedAt: row.approvedAt,
    values: {
      ruleCode: row.values.ruleCode,
      supplierCost: row.values.supplierCost,
      externalRetail: row.values.externalRetail,
      externalWholesale: row.values.externalWholesale,
      source: row.values.source,
      sourceDate: row.values.sourceDate,
      sourceReviewed: row.values.sourceReviewed,
    },
  };
}
