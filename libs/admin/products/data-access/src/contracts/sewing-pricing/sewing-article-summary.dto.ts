import type { operations } from '@admin/shared/contracts';

export type SewingArticleSummaryDto =
  operations['getSewingArticleSummary']['responses'][200]['content']['application/json'];
