import { nullablePpeAmount, ppeText, validPpeVersion } from './ppe-pricing-values';
import { ensurePricing, pricingId, pricingRecord } from '../pricing/pricing-values';

import type { PpeOfferDto } from '../../contracts/ppe-pricing/ppe-offer.dto';

export function validatePpeOffer(value: unknown): PpeOfferDto {
  const row = pricingRecord(value);
  const values = pricingRecord(row['values']);
  ensurePricing(
    validPpeVersion(value) &&
      pricingId(row['productId']) &&
      (values['ruleCode'] === null || ppeText(values['ruleCode'])) &&
      nullablePpeAmount(values['supplierCost']) &&
      nullablePpeAmount(values['externalRetail']) &&
      nullablePpeAmount(values['externalWholesale']) &&
      ppeText(values['source']) &&
      ppeText(values['sourceDate']) &&
      typeof values['sourceReviewed'] === 'boolean',
  );
  return value as PpeOfferDto;
}
