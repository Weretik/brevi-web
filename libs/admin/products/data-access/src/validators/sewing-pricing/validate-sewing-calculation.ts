import {
  ensurePricing,
  pricingAmount,
  pricingDate,
  pricingId,
  pricingRecord,
  pricingUuid,
  pricingVersion,
  validPricingTiers,
} from '../pricing/pricing-values';

import type { SewingCalculationDto } from '../../contracts/sewing-pricing/sewing-calculation.dto';

export function validateSewingCalculation(value: unknown): SewingCalculationDto {
  const row = pricingRecord(value);
  const snapshot = pricingRecord(row['snapshot']);
  const calculation = pricingRecord(snapshot['calculation']);
  ensurePricing(
    pricingUuid(row['id']) &&
      pricingUuid(row['requestId']) &&
      pricingDate(row['createdAt']) &&
      pricingId(snapshot['productId']) &&
      pricingId(snapshot['articleId']) &&
      typeof snapshot['saleSku'] === 'string' &&
      pricingVersion(snapshot['compositionVersion']) &&
      (snapshot['settingsVersionId'] === null || pricingId(snapshot['settingsVersionId'])) &&
      Array.isArray(snapshot['referenceVersionIds']) &&
      snapshot['referenceVersionIds'].every(pricingId) &&
      typeof calculation['isCalculated'] === 'boolean' &&
      Array.isArray(calculation['blockers']),
  );
  for (const value of calculation['blockers'] as unknown[]) {
    const blocker = pricingRecord(value);
    ensurePricing(
      typeof blocker['code'] === 'string' &&
        (blocker['inputKey'] === null || typeof blocker['inputKey'] === 'string'),
    );
  }
  if (snapshot['settings'] !== null) {
    const settings = pricingRecord(snapshot['settings']);
    ensurePricing(
      pricingId(settings['revision']) &&
        pricingId(settings['id']) &&
        settings['id'] === snapshot['settingsVersionId'],
    );
  }
  if (calculation['isCalculated']) {
    const breakdown = pricingRecord(calculation['breakdown']);
    ensurePricing(
      snapshot['settings'] !== null &&
        snapshot['settingsVersionId'] !== null &&
        (calculation['blockers'] as unknown[]).length === 0 &&
        validPricingTiers(calculation['prices']) &&
        [
          'materials',
          'otherCosts',
          'seamstress',
          'cutting',
          'master',
          'manager',
          'bonus',
          'overhead',
          'fullCost',
          'totalMinutes',
          'minuteCost',
        ].every((key) => pricingAmount(breakdown[key])),
    );
  } else
    ensurePricing(
      calculation['prices'] === null &&
        calculation['breakdown'] === null &&
        (calculation['blockers'] as unknown[]).length > 0,
    );
  return value as SewingCalculationDto;
}
