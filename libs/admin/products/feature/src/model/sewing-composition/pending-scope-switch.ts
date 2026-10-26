import type { SewingArticleCreateDraft } from '@admin/products/model';

export type PendingSewingScopeSwitch =
  | { scope: 'Model' }
  | { scope: 'Article'; articleId: number }
  | { scope: 'CreateArticle'; draft: SewingArticleCreateDraft };
