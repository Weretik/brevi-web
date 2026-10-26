import { ppeText, validPpeVersion } from './ppe-pricing-values';
import { ensurePricing, pricingRecord, validPricingTiers } from '../pricing/pricing-values';

import type { PpeRuleDto } from '../../contracts/ppe-pricing/ppe-rule.dto';

export function validatePpeRule(value: unknown): PpeRuleDto {
  const row = pricingRecord(value);
  const values = pricingRecord(row['values']);
  ensurePricing(
    validPpeVersion(value) &&
      ppeText(values['code']) &&
      ppeText(values['source']) &&
      ppeText(values['sourceDate']) &&
      validPricingTiers(values['markups']),
  );
  return value as PpeRuleDto;
}
