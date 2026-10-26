import { ensurePricing } from '../../validators/pricing/pricing-values';
import { validateSewingPublication } from '../../validators/sewing-pricing/validate-sewing-publication';

import type { SewingPublication } from '@admin/products/model';

export function mapSewingPublication(
  value: unknown,
  scope: { productId: number; articleId: number; calculationId?: string },
): SewingPublication {
  const dto = validateSewingPublication(value);
  ensurePricing(
    dto.productId === scope.productId &&
      dto.articleId === scope.articleId &&
      (!scope.calculationId || dto.calculationId === scope.calculationId),
  );
  return {
    id: dto.id,
    calculationId: dto.calculationId,
    productId: dto.productId,
    articleId: dto.articleId,
    publishedAt: dto.publishedAt,
    prices: {
      retail: dto.prices.retail,
      wholesale: dto.prices.wholesale,
      largeWholesale: dto.prices.largeWholesale,
    },
  };
}
