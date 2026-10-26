import type { SewingPriceTiers } from './sewing-price-tiers';

export interface PublishedSewingProduct {
  productId: number;
  articleCount: number;
  articles: Array<{
    articleId: number;
    saleSku: string;
    publicationId: string;
    calculationId: string;
    publishedAt: string;
    prices: SewingPriceTiers;
  }>;
}
