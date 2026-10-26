import { pricingAmount, pricingDate, pricingRecord, pricingUuid } from '../pricing/pricing-values';

export const nullablePpeAmount = (value: unknown) => value === null || pricingAmount(value);
export const ppeText = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;
export function validPpeVersion(value: unknown): boolean {
  const row = pricingRecord(value);
  return (
    pricingUuid(row['id']) &&
    typeof row['isApproved'] === 'boolean' &&
    (row['isApproved'] ? pricingDate(row['approvedAt']) : row['approvedAt'] === null)
  );
}
