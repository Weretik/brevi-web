import { pricingDate, pricingId, validPricingTiers } from '../pricing/pricing-values';
import { entries, number, record } from '../response-validation';

import type {
  ProductOverviewItemResponse,
  ProductOverviewPageResponse,
} from '../../contracts/product-overview/product-overview.dto';

const isText = (value: unknown) => value === null || typeof value === 'string';
const isType = (value: unknown) => value === 'Sewing' || value === 'Ppe';
const isSeason = (value: unknown) => value === null || value === 'Літо' || value === 'Зима';
const isSectionId = (value: unknown) =>
  value === null || (Number.isInteger(value) && (value as number) > 0);
const isCodes = (value: unknown) => entries(value, (item) => typeof item === 'string');
const optionalTiers = (value: unknown) => value === null || validPricingTiers(value);
const optionalDate = (value: unknown) => value === null || pricingDate(value);
const isCount = (value: unknown) => Number.isInteger(value) && (value as number) >= 0;

function validVariant(value: unknown): boolean {
  const row = record(value);
  return (
    pricingId(row['articleId']) &&
    typeof row['saleSku'] === 'string' &&
    typeof row['active'] === 'boolean' &&
    (row['fabricId'] === null || pricingId(row['fabricId'])) &&
    isText(row['fabricName']) &&
    optionalTiers(row['prices']) &&
    optionalDate(row['publishedAt']) &&
    isCodes(row['problems'])
  );
}

function validItem(value: unknown): boolean {
  const row = record(value);
  return (
    Number.isInteger(row['id']) &&
    (row['id'] as number) > 0 &&
    isType(row['type']) &&
    isText(row['code']) &&
    typeof row['name'] === 'string' &&
    isSectionId(row['sectionId']) &&
    isSeason(row['season']) &&
    typeof row['isActive'] === 'boolean' &&
    isText(row['currentSiteUrl']) &&
    isText(row['quoteDescription']) &&
    typeof row['updatedAtUtc'] === 'string' &&
    optionalTiers(row['prices']) &&
    optionalDate(row['pricesUpdatedAt']) &&
    isCodes(row['problems']) &&
    entries(row['variants'], validVariant) &&
    (row['mainPhotoUrl'] === undefined || isText(row['mainPhotoUrl']))
  );
}

export function parseProductOverviewItem(value: unknown): ProductOverviewItemResponse {
  if (!validItem(value)) throw new Error('Некоректний запис товару.');
  return value as ProductOverviewItemResponse;
}

export function parseProductOverviewPage(value: unknown): ProductOverviewPageResponse {
  const page = record(value);
  if (
    !entries(page['items'], validItem) ||
    !number(page['page']) ||
    !number(page['pageSize']) ||
    !isCount(page['total']) ||
    !isCount(page['all']) ||
    !isCount(page['withoutPrice']) ||
    (page['inactive'] !== undefined && !isCount(page['inactive'])) ||
    !entries(page['sections'], (item) => {
      const count = record(item);
      return isSectionId(count['sectionId']) && isCount(count['count']);
    })
  )
    throw new Error('Некоректна відповідь списку товарів.');
  return value as ProductOverviewPageResponse;
}
