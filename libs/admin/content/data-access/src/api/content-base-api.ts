import { adminApi } from '@admin/shared/api-client';

export const contentBaseApi = adminApi.enhanceEndpoints({
  addTagTypes: ['ContentProduct', 'SiteCategory'],
});
