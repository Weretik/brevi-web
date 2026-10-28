import { adminApi } from '@admin/shared/api-client';

export const customerBaseApi = adminApi.enhanceEndpoints({ addTagTypes: ['Customer'] });
