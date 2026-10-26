import type { SewingPriceTiers } from './sewing-price-tiers';

export interface SewingPublication {
  id: string;
  calculationId: string;
  productId: number;
  articleId: number;
  publishedAt: string;
  prices: SewingPriceTiers;
}
