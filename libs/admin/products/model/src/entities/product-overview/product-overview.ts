import type { SewingPriceTiers } from '../sewing-pricing/sewing-price-tiers';

/** The two tables of the «Товари» page: sheet tabs «Товари» (sewing models) and «ЗІЗ». */
export type ProductOverviewType = 'Sewing' | 'Ppe';

export const productOverviewTypeLabels: Record<ProductOverviewType, string> = {
  Sewing: 'Швейна продукція',
  Ppe: 'ЗІЗ',
};

/** «Сезон» of a sewing model, as in the sheet. */
export type ProductSeason = 'Літо' | 'Зима';

export const productSeasons: readonly ProductSeason[] = ['Літо', 'Зима'];

/**
 * A fabric variant of a sewing model (an Article): its fabric and current published prices (CAT-013).
 * `problems` are the calculation codes when an active variant has no price.
 */
export interface ProductVariant {
  articleId: number;
  saleSku: string;
  active: boolean;
  fabricId: number | null;
  fabricName: string | null;
  prices: SewingPriceTiers | null;
  publishedAt: string | null;
  problems: string[];
}

/**
 * One row of the «Товари» page: the product's working fields (no site texts or photos) with its prices.
 * Prices are published automatically (CAT-012), so the list only reads them (CAT-013).
 */
export interface ProductOverview {
  id: number;
  type: ProductOverviewType;
  /** Model ID (MOD-…) for sewing, site article for PPE. */
  code: string | null;
  name: string;
  /** Section from «Типи і розділи». */
  sectionId: number | null;
  season: ProductSeason | null;
  isActive: boolean;
  /** Product page on the current public site; quotes take photos from it (temporary). */
  currentSiteUrl: string | null;
  /** «Короткий опис для КП». */
  quoteDescription: string | null;
  updatedAtUtc: string;
  /** Lowest price of each tier among the active variants (sewing) or the rule price (PPE). */
  prices: SewingPriceTiers | null;
  pricesUpdatedAt: string | null;
  /** Why a price is missing (of the row or of an active variant); empty when everything is priced. */
  problems: string[];
  /** Fabric variants of a sewing model; empty for PPE. */
  variants: ProductVariant[];
  /** Preview of the main visible photo (CAT-018); the photo quotes use. */
  mainPhotoUrl: string | null;
  /** The same main photo in full size, for quick view (CAT-019). */
  mainPhotoFullUrl: string | null;
}

/** One page of a «Товари» tab from the server. */
export interface ProductOverviewPage {
  items: ProductOverview[];
  page: number;
  pageSize: number;
  /** Rows that match the search and filters. */
  total: number;
  /** Every row of the type. */
  all: number;
  /** Rows of the type per section; `sectionId` null counts rows without a section. */
  sections: { sectionId: number | null; count: number }[];
  /** Rows of the type without a price. */
  withoutPrice: number;
  /** Switched-off rows of the type. */
  inactive: number;
}

export type ProductOverviewSort = 'code' | 'name' | 'price' | 'updated';

/** What the list asks the server for. `section`: null shows every row, `'none'` rows without one. */
export interface ProductOverviewListQuery {
  type: ProductOverviewType;
  search: string;
  section: number | 'none' | null;
  withoutPrice: boolean;
  /** true: only active rows, false: only switched-off rows, null: both. */
  active: boolean | null;
  sort: ProductOverviewSort;
  direction: 'asc' | 'desc';
  /** 1-based. */
  page: number;
  pageSize: number;
}
