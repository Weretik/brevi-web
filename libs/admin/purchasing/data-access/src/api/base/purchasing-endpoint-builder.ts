import type { purchasingBaseApi } from './purchasing-base-api';

export type PurchasingEndpointBuilder = Parameters<
  Parameters<typeof purchasingBaseApi.injectEndpoints>[0]['endpoints']
>[0];
