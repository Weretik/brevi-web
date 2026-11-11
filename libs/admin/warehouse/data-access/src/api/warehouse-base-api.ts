import { adminApi } from '@admin/shared/api-client';

/**
 * «ItemFabric» is the fabric card of a production item; stock changes move its balances too. An issue
 * to an item also writes a line of the order's «Історія змін» («ProductionOrder»).
 */
export const warehouseBaseApi = adminApi.enhanceEndpoints({
  addTagTypes: ['FabricStock', 'FabricMovement', 'ItemFabric', 'ProductionOrder'],
});
