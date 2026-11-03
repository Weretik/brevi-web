import { adminApi } from '@admin/shared/api-client';

export const mediaBaseApi = adminApi.enhanceEndpoints({
  addTagTypes: ['MediaFolder', 'MediaFile'],
});
