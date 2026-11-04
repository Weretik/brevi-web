import { adminApi } from '@admin/shared/api-client';

/**
 * `EmbroiderySettings` covers «Налаштування», the form setup and every calculation made from them;
 * `EmbroideryCalculations` covers «Збережені».
 */
export const embroideryBaseApi = adminApi.enhanceEndpoints({
  addTagTypes: ['EmbroiderySettings', 'EmbroideryCalculations'],
});
