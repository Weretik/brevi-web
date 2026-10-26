import { validatePpeRule } from '../../validators/ppe-pricing/validate-ppe-rule';
import { ensurePricing } from '../../validators/pricing/pricing-values';

import type { PpeRuleVersion } from '@admin/products/model';

export function mapPpeRule(value: unknown, code: string): PpeRuleVersion {
  const row = validatePpeRule(value);
  ensurePricing(row.values.code === code);
  return {
    id: row.id,
    isApproved: row.isApproved,
    approvedAt: row.approvedAt,
    values: {
      code: row.values.code,
      source: row.values.source,
      sourceDate: row.values.sourceDate,
      markups: {
        retail: row.values.markups.retail,
        wholesale: row.values.markups.wholesale,
        largeWholesale: row.values.markups.largeWholesale,
      },
    },
  };
}
