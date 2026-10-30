import { adminApi } from '@admin/shared/api-client';

export const customBaseApi = adminApi.enhanceEndpoints({ addTagTypes: ['CustomSewing'] });
