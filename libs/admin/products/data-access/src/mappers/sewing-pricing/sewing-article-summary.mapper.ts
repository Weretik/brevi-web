import { ensurePricing } from '../../validators/pricing/pricing-values';
import { validateSewingArticleSummary } from '../../validators/sewing-pricing/validate-sewing-article-summary';

import type { SewingArticleSummary, SewingCostKind } from '@admin/products/model';

const costKinds: SewingCostKind[] = [
  'materials',
  'otherCosts',
  'seamstress',
  'cutting',
  'master',
  'manager',
  'bonus',
  'overhead',
];

export function mapSewingArticleSummary(value: unknown, productId: number): SewingArticleSummary {
  const dto = validateSewingArticleSummary(value);
  ensurePricing(dto.productId === productId);
  return {
    productId: dto.productId,
    modelCode: dto.modelCode,
    version: dto.version,
    calculatedAt: dto.calculatedAt,
    articles: dto.articles.map((row) => ({
      id: row.id,
      saleSku: row.saleSku,
      active: row.active,
      sortOrder: row.sortOrder,
      calculated: row.isCalculated,
      blockers: row.blockers.map((item) => ({ code: item.code, inputKey: item.inputKey })),
      costs: row.costs ? costKinds.map((kind) => ({ kind, amount: row.costs![kind] })) : [],
      minutes: row.costs?.totalMinutes ?? null,
      minuteCost: row.costs?.minuteCost ?? null,
      fullCost: row.costs?.fullCost ?? null,
      prices: row.prices
        ? {
            retail: row.prices.retail,
            wholesale: row.prices.wholesale,
            largeWholesale: row.prices.largeWholesale,
          }
        : null,
      published: row.published
        ? {
            publishedAt: row.published.publishedAt,
            prices: {
              retail: row.published.prices.retail,
              wholesale: row.published.prices.wholesale,
              largeWholesale: row.published.prices.largeWholesale,
            },
          }
        : null,
    })),
  };
}
