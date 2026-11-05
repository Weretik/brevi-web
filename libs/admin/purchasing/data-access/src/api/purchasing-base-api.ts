import { adminApi } from '@admin/shared/api-client';

export const purchasingBaseApi = adminApi.enhanceEndpoints({
  addTagTypes: ['PurchaseInvoice'],
});
