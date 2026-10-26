export interface SewingArticle {
  id: number;
  productId: number;
  saleSku: string;
  active: boolean;
  sortOrder: number;
  readiness?: { ready: boolean; blockers: string[] };
}
