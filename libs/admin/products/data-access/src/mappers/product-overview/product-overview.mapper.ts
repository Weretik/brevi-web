import type {
  ProductOverviewItemResponse,
  ProductOverviewPageResponse,
} from '../../contracts/product-overview/product-overview.dto';
import type {
  ProductOverview,
  ProductOverviewListQuery,
  ProductOverviewPage,
  ProductOverviewType,
  ProductSeason,
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
    type: row.type as ProductOverviewType,
    code: row.code ?? null,
    name: row.name,
    sectionId: row.sectionId ?? null,
    season: (row.season ?? null) as ProductSeason | null,
    isActive: row.isActive,
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
    mainPhotoUrl: row.mainPhotoUrl ?? null,
    mainPhotoFullUrl: row.mainPhotoFullUrl ?? null,
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
    inactive: value.inactive ?? 0,
  };
}

/** Query string of `getProductOverview`; empty values are left out. */
export function productOverviewQueryParams(query: ProductOverviewListQuery) {
  const search = query.search.trim();
  return {
    type: query.type,
    ...(search ? { search } : {}),
    ...(query.section !== null ? { section: String(query.section) } : {}),
    ...(query.withoutPrice ? { withoutPrice: true } : {}),
    ...(query.active !== null ? { active: query.active } : {}),
    ...(query.sort !== 'code' ? { sort: query.sort } : {}),
    ...(query.direction !== 'asc' ? { direction: query.direction } : {}),
    page: query.page,
    pageSize: query.pageSize,
  };
}
