import type { operations } from '@admin/shared/contracts';

export type SewingArticleListDto =
  operations['listSewingArticles']['responses'][200]['content']['application/json'];
