import { adminApi } from '@admin/shared/api-client';

export const quoteBaseApi = adminApi.enhanceEndpoints({ addTagTypes: ['Quote'] });
