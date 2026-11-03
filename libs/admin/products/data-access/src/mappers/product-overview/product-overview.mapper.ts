import type {
  ProductOverviewItemResponse,
  ProductOverviewPageResponse,
} from '../../contracts/product-overview/product-overview.dto';
import type {
  ProductOverview,
  ProductOverviewListQuery,
  ProductOverviewPage,
  SewingPriceTiers,
} from '@admin/products/model';

type Tiers = { retail: number; wholesale: number; largeWholesale: number } | null | undefined;

const tiers = (value: Tiers): SewingPriceTiers | null =>
  value
    ? { retail: value.retail, wholesale: value.wholesale, largeWholesale: value.largeWholesale }
    : null;

export function mapProductOverviewItem(row: ProductOverviewItemResponse): ProductOverview {
  return {
    id: row.id,
    type: row.type,
    code: row.code ?? null,
    name: row.name,
    sectionId: row.sectionId ?? null,
    season: row.season ?? null,
    isActive: row.isActive,
    isVerified: row.isVerified,
    verifiedOn: row.verifiedOn ?? null,
    currentSiteUrl: row.currentSiteUrl ?? null,
    quoteDescription: row.quoteDescription ?? null,
    updatedAtUtc: row.updatedAtUtc,
    prices: tiers(row.prices),
    pricesUpdatedAt: row.pricesUpdatedAt ?? null,
    problems: row.problems,
    variants: row.variants.map((variant) => ({
      articleId: variant.articleId,
      saleSku: variant.saleSku,
      active: variant.active,
      fabricId: variant.fabricId ?? null,
      fabricName: variant.fabricName ?? null,
      prices: tiers(variant.prices),
      publishedAt: variant.publishedAt ?? null,
      problems: variant.problems,
    })),
  };
}

export function mapProductOverviewPage(value: ProductOverviewPageResponse): ProductOverviewPage {
  return {
    items: value.items.map(mapProductOverviewItem),
    page: value.page,
    pageSize: value.pageSize,
    total: value.total,
    all: value.all,
    sections: value.sections.map((item) => ({
      sectionId: item.sectionId ?? null,
      count: item.count,
    })),
    withoutPrice: value.withoutPrice,
  };
}

/** Query string of `getProductOverview`; empty values are left out. */
export function productOverviewSearchParams(query: ProductOverviewListQuery): string {
  const params = new URLSearchParams({ type: query.type });
  const search = query.search.trim();
  if (search) params.set('search', search);
  if (query.section !== null) params.set('section', String(query.section));
  if (query.withoutPrice) params.set('withoutPrice', 'true');
  if (query.sort !== 'code') params.set('sort', query.sort);
  if (query.direction !== 'asc') params.set('direction', query.direction);
  params.set('page', String(query.page));
  params.set('pageSize', String(query.pageSize));
  return params.toString();
}
