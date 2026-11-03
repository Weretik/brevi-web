import type { ProductOverviewPricesResponse } from '../../contracts/product-overview/product-overview-prices.dto';
import type {
  ProductOverviewPrices,
  ProductPriceStatus,
  SewingPriceTiers,
} from '@admin/products/model';

type Tiers = { retail: number; wholesale: number; largeWholesale: number } | null | undefined;

const tiers = (value: Tiers): SewingPriceTiers | null =>
  value
    ? { retail: value.retail, wholesale: value.wholesale, largeWholesale: value.largeWholesale }
    : null;

export function mapProductOverviewPrices(
  value: ProductOverviewPricesResponse,
): ProductOverviewPrices[] {
  return value.map((row) => ({
    productId: row.productId,
    status: row.status as ProductPriceStatus,
    from: tiers(row.from),
    pricesUpdatedAt: row.pricesUpdatedAt ?? null,
    blockers: row.blockers,
    articles: row.articles.map((article) => ({
      articleId: article.articleId,
      saleSku: article.saleSku,
      active: article.active,
      fabricId: article.fabricId ?? null,
      published: tiers(article.published),
      publishedAt: article.publishedAt ?? null,
      live: tiers(article.live),
      isStale: article.isStale,
      blockers: article.blockers,
    })),
  }));
}
