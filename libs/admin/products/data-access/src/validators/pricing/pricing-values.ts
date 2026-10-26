import { record } from '../response-validation';

export const pricingRecord = record;
export const pricingAmount = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0;
export const pricingId = (value: unknown): value is number =>
  pricingAmount(value) && Number.isSafeInteger(value) && value > 0;
export const pricingVersion = (value: unknown): value is number =>
  pricingAmount(value) && Number.isSafeInteger(value);
export const pricingUuid = (value: unknown): value is string =>
  typeof value === 'string' &&
  /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(value) &&
  value !== '00000000-0000-0000-0000-000000000000';
export const pricingDate = (value: unknown): value is string =>
  typeof value === 'string' && Number.isFinite(Date.parse(value));

export function ensurePricing(valid: boolean): asserts valid {
  if (!valid) throw new Error('Некоректна відповідь щодо розрахунку ціни.');
}

export function validPricingTiers(value: unknown): boolean {
  const row = record(value);
  return ['retail', 'wholesale', 'largeWholesale'].every((key) => pricingAmount(row[key]));
}
