import {
  ensurePricing,
  pricingDate,
  pricingId,
  validPricingTiers,
} from '../pricing/pricing-values';
import { entries, record } from '../response-validation';

import type {
  ProductOverviewPricesResponse,
  SewingRecalculationReportResponse,
} from '../../contracts/product-overview/product-overview-prices.dto';

const statuses = ['Ready', 'Stale', 'Unpublished', 'Blocked'];
const isCodes = (value: unknown) => entries(value, (item) => typeof item === 'string');
const optionalTiers = (value: unknown) => value === null || validPricingTiers(value);
const optionalDate = (value: unknown) => value === null || pricingDate(value);
const optionalText = (value: unknown) => value === null || typeof value === 'string';

function validArticle(value: unknown): boolean {
  const row = record(value);
  return (
    pricingId(row['articleId']) &&
    typeof row['saleSku'] === 'string' &&
    typeof row['active'] === 'boolean' &&
    (row['fabricId'] === null || pricingId(row['fabricId'])) &&
    optionalTiers(row['published']) &&
    optionalDate(row['publishedAt']) &&
    optionalTiers(row['live']) &&
    typeof row['isStale'] === 'boolean' &&
    isCodes(row['blockers'])
  );
}

function validRow(value: unknown): boolean {
  const row = record(value);
  return (
    pricingId(row['productId']) &&
    statuses.includes(row['status'] as string) &&
    optionalTiers(row['from']) &&
    optionalDate(row['pricesUpdatedAt']) &&
    isCodes(row['blockers']) &&
    entries(row['articles'], validArticle)
  );
}

export function parseProductOverviewPrices(value: unknown): ProductOverviewPricesResponse {
  ensurePricing(entries(value, validRow));
  return value as ProductOverviewPricesResponse;
}

function validReportLine(value: unknown, extra: (row: Record<string, unknown>) => boolean) {
  const row = record(value);
  return (
    pricingId(row['productId']) &&
    optionalText(row['modelCode']) &&
    pricingId(row['articleId']) &&
    typeof row['saleSku'] === 'string' &&
    extra(row)
  );
}

export function parseSewingRecalculationReport(value: unknown): SewingRecalculationReportResponse {
  const report = record(value);
  ensurePricing(
    typeof report['applied'] === 'boolean' &&
      Number.isSafeInteger(report['unchanged']) &&
      entries(report['changes'], (item) =>
        validReportLine(
          item,
          (row) => optionalTiers(row['before']) && validPricingTiers(row['after']),
        ),
      ) &&
      entries(report['blocked'], (item) =>
        validReportLine(item, (row) => isCodes(row['blockers'])),
      ),
  );
  return value as SewingRecalculationReportResponse;
}
