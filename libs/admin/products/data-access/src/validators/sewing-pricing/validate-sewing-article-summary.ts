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

const nullableText = (value: unknown) => value === null || typeof value === 'string';
const nullableAmount = (value: unknown) => value === null || pricingAmount(value);
const nullableId = (value: unknown) => value === null || pricingId(value);
const positive = (value: unknown) =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;

function validRow(value: unknown): boolean {
  const row = pricingRecord(value);
  if (
    !pricingId(row['id']) ||
    typeof row['saleSku'] !== 'string' ||
    typeof row['active'] !== 'boolean' ||
    !pricingVersion(row['sortOrder']) ||
    !nullableId(row['fabricId']) ||
    !nullableText(row['fabricName']) ||
    !nullableAmount(row['fabricPrice']) ||
    !(row['fabricQuantity'] === null || positive(row['fabricQuantity'])) ||
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

const materialKinds = ['Fabric', 'Accessory', 'OtherCost'];
const materialUnits = ['Metre', 'Piece', 'Service', 'Kilogram'];

function validMaterial(value: unknown): boolean {
  const line = pricingRecord(value);
  return (
    pricingId(line['id']) &&
    materialKinds.includes(line['kind'] as string) &&
    nullableId(line['referenceId']) &&
    nullableText(line['costCode']) &&
    nullableText(line['name']) &&
    nullableAmount(line['unitPrice']) &&
    positive(line['quantity']) &&
    materialUnits.includes(line['unit'] as string) &&
    pricingVersion(line['sortOrder']) &&
    nullableText(line['comment'])
  );
}

function validOperation(value: unknown): boolean {
  const line = pricingRecord(value);
  return (
    pricingId(line['id']) &&
    pricingId(line['operationId']) &&
    nullableText(line['name']) &&
    nullableAmount(line['normMinutes']) &&
    positive(line['quantity']) &&
    (line['manualMinutes'] === null || positive(line['manualMinutes'])) &&
    pricingVersion(line['sortOrder']) &&
    nullableText(line['comment'])
  );
}

export function validateSewingArticleSummary(value: unknown): SewingArticleSummaryDto {
  const summary = pricingRecord(value);
  ensurePricing(
    pricingId(summary['productId']) &&
      (summary['modelCode'] === null || typeof summary['modelCode'] === 'string') &&
      pricingVersion(summary['version']) &&
      pricingDate(summary['calculatedAt']) &&
      Array.isArray(summary['articles']) &&
      summary['articles'].every(validRow) &&
      Array.isArray(summary['materials']) &&
      summary['materials'].every(validMaterial) &&
      Array.isArray(summary['operations']) &&
      summary['operations'].every(validOperation),
  );
  return value as SewingArticleSummaryDto;
}
