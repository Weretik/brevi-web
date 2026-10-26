import { validatePublishedSewingProducts } from '../../validators/sewing-pricing/validate-published-sewing-products';

import type { PublishedSewingProduct } from '@admin/products/model';

export function mapPublishedSewingProducts(
  value: unknown,
  productIds: number[],
): PublishedSewingProduct[] {
  return validatePublishedSewingProducts(value, productIds).map((product) => ({
    productId: product.productId,
    articleCount: product.articleCount,
    articles: product.articles.map((article) => ({
      articleId: article.articleId,
      saleSku: article.saleSku,
      publicationId: article.publicationId,
      calculationId: article.calculationId,
      publishedAt: article.publishedAt,
      prices: {
        retail: article.prices.retail,
        wholesale: article.prices.wholesale,
        largeWholesale: article.prices.largeWholesale,
      },
    })),
  }));
}
