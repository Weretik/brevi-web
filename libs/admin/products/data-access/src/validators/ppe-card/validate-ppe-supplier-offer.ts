import {
  ensurePricing,
  pricingAmount,
  pricingDate,
  pricingId,
  pricingRecord,
  pricingUuid,
  validPricingTiers,
} from '../pricing/pricing-values';

import type { PpeSupplierOfferDto } from '../../contracts/ppe-card/ppe-supplier-offer.dto';

const text = (value: unknown) => value === null || typeof value === 'string';
const amount = (value: unknown) => value === null || pricingAmount(value);

export function validatePpeSupplierOffer(value: unknown): PpeSupplierOfferDto {
  const row = pricingRecord(value);
  const calc = pricingRecord(row['calculation']);
  const blockers = calc['blockers'];
  ensurePricing(
    pricingId(row['productId']) &&
      ['unit', 'supplierName', 'supplierSku', 'supplierUrl', 'ruleCode'].every((key) =>
        text(row[key]),
      ) &&
      (row['supplierId'] === null || pricingId(row['supplierId'])) &&
      ['supplierPrice', 'insightWholesale', 'insightRetail'].every((key) => amount(row[key])) &&
      typeof row['allowManualPrice'] === 'boolean' &&
      (row['offerVersionId'] === null || pricingUuid(row['offerVersionId'])) &&
      (row['priceUpdatedAt'] === null || pricingDate(row['priceUpdatedAt'])) &&
      Array.isArray(blockers) &&
      blockers.every((item: unknown) => typeof pricingRecord(item)['code'] === 'string'),
  );
  ensurePricing(
    calc['isCalculated'] === true
      ? validPricingTiers(calc['prices']) && (blockers as unknown[]).length === 0
      : calc['isCalculated'] === false &&
          calc['prices'] === null &&
          (blockers as unknown[]).length > 0,
  );
  return value as PpeSupplierOfferDto;
}
