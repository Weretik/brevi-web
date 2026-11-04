import { adminApi } from '@admin/shared/api-client';

export const quotesBaseApi = adminApi.enhanceEndpoints({
  addTagTypes: ['Quote', 'QuoteList', 'QuoteHistory', 'QuoteSettings', 'QuoteIntroTemplates'],
});
