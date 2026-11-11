import { adminApi } from '@admin/shared/api-client';

/** «ItemFabric» is the «Тканина» tab of a production item; stock changes move its balances too. */
export const warehouseBaseApi = adminApi.enhanceEndpoints({
  addTagTypes: ['FabricStock', 'FabricMovement', 'ItemFabric'],
});
