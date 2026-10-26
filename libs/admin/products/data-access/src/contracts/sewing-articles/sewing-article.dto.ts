import type { operations } from '@admin/shared/contracts';

export type SewingArticleDto =
  operations['createSewingArticle']['responses'][201]['content']['application/json'];
