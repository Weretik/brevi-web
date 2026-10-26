import {
  ensurePricing,
  pricingDate,
  pricingId,
  pricingRecord,
  pricingUuid,
  validPricingTiers,
} from '../pricing/pricing-values';

import type { SewingPublicationDto } from '../../contracts/sewing-pricing/sewing-publication.dto';

export function validateSewingPublication(value: unknown): SewingPublicationDto {
  const row = pricingRecord(value);
  ensurePricing(
    pricingUuid(row['id']) &&
      pricingUuid(row['calculationId']) &&
      pricingId(row['productId']) &&
      pricingId(row['articleId']) &&
      pricingDate(row['publishedAt']) &&
      validPricingTiers(row['prices']),
  );
  return value as SewingPublicationDto;
}
