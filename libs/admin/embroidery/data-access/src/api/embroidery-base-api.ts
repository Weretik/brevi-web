import { adminApi } from '@admin/shared/api-client';

/** `EmbroiderySettings` covers «Налаштування», the form setup and every calculation made from them. */
export const embroideryBaseApi = adminApi.enhanceEndpoints({
  addTagTypes: ['EmbroiderySettings'],
});
