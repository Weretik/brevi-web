import type { SewingArticle } from './sewing-article';

export interface SewingArticleList {
  productId: number;
  modelCode: string | null;
  version: number;
  articles: SewingArticle[];
}
