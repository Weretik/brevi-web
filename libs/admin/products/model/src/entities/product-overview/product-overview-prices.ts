import type { SewingPriceTiers } from '../sewing-pricing/sewing-price-tiers';

/**
 * Price state of one «Товари» row (CAT-011): Ready (published and current), Stale (a published price
 * differs from today's calculation), Unpublished (a calculable Article has no published price), Blocked.
 */
export type ProductPriceStatus = 'Ready' | 'Stale' | 'Unpublished' | 'Blocked';

/** One sewing Article: the fixed (published) price and the live price from today's inputs. */
export interface ProductArticlePrices {
  articleId: number;
  saleSku: string;
  active: boolean;
  /** The fabric that names the Article in the price list. */
  fabricId: number | null;
  published: SewingPriceTiers | null;
  publishedAt: string | null;
  live: SewingPriceTiers | null;
  isStale: boolean;
  blockers: string[];
}

export interface ProductOverviewPrices {
  productId: number;
  status: ProductPriceStatus;
  /** Lowest published price of each tier among active Articles; the live PPE price. */
  from: SewingPriceTiers | null;
  pricesUpdatedAt: string | null;
  blockers: string[];
  articles: ProductArticlePrices[];
}
