import type { SewingPriceCalculation } from '../sewing-pricing/sewing-price-calculation';
import type { SewingPriceTiers } from '../sewing-pricing/sewing-price-tiers';

/** One site Article of a sewing model with its live price, as in the sheet «Прайс на сайт». */
export interface SewingArticleSummaryRow {
  id: number;
  saleSku: string;
  active: boolean;
  sortOrder: number;
  calculated: boolean;
  blockers: SewingPriceCalculation['blockers'];
  costs: SewingPriceCalculation['costs'];
  minutes: number | null;
  minuteCost: number | null;
  fullCost: number | null;
  prices: SewingPriceTiers | null;
  published: { publishedAt: string; prices: SewingPriceTiers } | null;
}

/** Live calculation of every Article of one sewing model (server time, nothing saved). */
export interface SewingArticleSummary {
  productId: number;
  modelCode: string | null;
  version: number;
  calculatedAt: string;
  articles: SewingArticleSummaryRow[];
}
