import type {
  ProductOverviewPricesResponse,
  SewingRecalculationReportResponse,
} from '../../contracts/product-overview/product-overview-prices.dto';
import type {
  ProductOverviewPrices,
  ProductPriceStatus,
  SewingPriceTiers,
  SewingRecalculationReport,
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

export function mapSewingRecalculationReport(
  value: SewingRecalculationReportResponse,
): SewingRecalculationReport {
  return {
    applied: value.applied,
    unchanged: value.unchanged,
    changes: value.changes.map((change) => ({
      productId: change.productId,
      modelCode: change.modelCode ?? null,
      articleId: change.articleId,
      saleSku: change.saleSku,
      before: tiers(change.before),
      after: tiers(change.after) as SewingPriceTiers,
    })),
    blocked: value.blocked.map((line) => ({
      productId: line.productId,
      modelCode: line.modelCode ?? null,
      articleId: line.articleId,
      saleSku: line.saleSku,
      blockers: line.blockers,
    })),
  };
}
