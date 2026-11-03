import type { ProductOverviewResponse } from '../../contracts/product-overview/product-overview.dto';

const isText = (value: unknown) => value === null || typeof value === 'string';
const isType = (value: unknown) => value === 'Sewing' || value === 'Ppe';
const isSeason = (value: unknown) => value === null || value === 'Літо' || value === 'Зима';
const isSectionId = (value: unknown) =>
  value === null || (Number.isInteger(value) && (value as number) > 0);

export function parseProductOverviewResponse(value: unknown): ProductOverviewResponse {
  if (!Array.isArray(value)) throw new Error('Некоректна відповідь списку товарів.');
  for (const item of value) {
    const row = (item ?? {}) as Record<string, unknown>;
    if (
      !Number.isInteger(row['id']) ||
      (row['id'] as number) <= 0 ||
      !isType(row['type']) ||
      !isText(row['code']) ||
      typeof row['name'] !== 'string' ||
      !isSectionId(row['sectionId']) ||
      !isSeason(row['season']) ||
      typeof row['isActive'] !== 'boolean' ||
      typeof row['isVerified'] !== 'boolean' ||
      !isText(row['verifiedOn']) ||
      !isText(row['currentSiteUrl']) ||
      !isText(row['quoteDescription']) ||
      typeof row['updatedAtUtc'] !== 'string'
    )
      throw new Error('Некоректний запис товару.');
  }
  return value as ProductOverviewResponse;
}
