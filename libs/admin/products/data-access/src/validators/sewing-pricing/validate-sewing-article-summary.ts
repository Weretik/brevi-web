import {
  ensurePricing,
  pricingAmount,
  pricingDate,
  pricingId,
  pricingRecord,
  pricingVersion,
  validPricingTiers,
} from '../pricing/pricing-values';

import type { SewingArticleSummaryDto } from '../../contracts/sewing-pricing/sewing-article-summary.dto';

const breakdownKeys = [
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
];

function validRow(value: unknown): boolean {
  const row = pricingRecord(value);
  if (
    !pricingId(row['id']) ||
    typeof row['saleSku'] !== 'string' ||
    typeof row['active'] !== 'boolean' ||
    !pricingVersion(row['sortOrder']) ||
    typeof row['isCalculated'] !== 'boolean' ||
    !Array.isArray(row['blockers'])
  )
    return false;
  const blockersValid = (row['blockers'] as unknown[]).every((item) => {
    const blocker = pricingRecord(item);
    return (
      typeof blocker['code'] === 'string' &&
      (blocker['inputKey'] === null || typeof blocker['inputKey'] === 'string')
    );
  });
  const published = row['published'];
  const publishedValid =
    published === null ||
    (pricingDate(pricingRecord(published)['publishedAt']) &&
      validPricingTiers(pricingRecord(published)['prices']));
  const costs = row['costs'];
  const calculatedValid = row['isCalculated']
    ? (row['blockers'] as unknown[]).length === 0 &&
      validPricingTiers(row['prices']) &&
      breakdownKeys.every((key) => pricingAmount(pricingRecord(costs)[key]))
    : row['prices'] === null && costs === null && (row['blockers'] as unknown[]).length > 0;
  return blockersValid && publishedValid && calculatedValid;
}

export function validateSewingArticleSummary(value: unknown): SewingArticleSummaryDto {
  const summary = pricingRecord(value);
  ensurePricing(
    pricingId(summary['productId']) &&
      (summary['modelCode'] === null || typeof summary['modelCode'] === 'string') &&
      pricingVersion(summary['version']) &&
      pricingDate(summary['calculatedAt']) &&
      Array.isArray(summary['articles']) &&
      summary['articles'].every(validRow),
  );
  return value as SewingArticleSummaryDto;
}
