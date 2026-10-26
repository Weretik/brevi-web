import {
  ensurePricing,
  pricingDate,
  pricingId,
  pricingRecord,
  pricingUuid,
  pricingVersion,
  validPricingTiers,
} from '../pricing/pricing-values';

import type { PublishedSewingProductsDto } from '../../contracts/sewing-pricing/published-sewing-products.dto';

export function validatePublishedSewingProducts(
  value: unknown,
  productIds: number[],
): PublishedSewingProductsDto {
  ensurePricing(Array.isArray(value));
  const products = new Set<number>();
  for (const item of value) {
    const row = pricingRecord(item);
    ensurePricing(
      pricingId(row['productId']) &&
        productIds.includes(row['productId']) &&
        !products.has(row['productId']) &&
        pricingVersion(row['articleCount']) &&
        Array.isArray(row['articles']),
    );
    products.add(row['productId'] as number);
    const ids = new Set<number>();
    for (const item of row['articles'] as unknown[]) {
      const article = pricingRecord(item);
      ensurePricing(
        pricingId(article['articleId']) &&
          !ids.has(article['articleId']) &&
          typeof article['saleSku'] === 'string' &&
          pricingUuid(article['publicationId']) &&
          pricingUuid(article['calculationId']) &&
          pricingDate(article['publishedAt']) &&
          validPricingTiers(article['prices']),
      );
      ids.add(article['articleId'] as number);
    }
    ensurePricing(ids.size <= (row['articleCount'] as number));
  }
  return value as PublishedSewingProductsDto;
}
