import type { accountingBaseApi } from './accounting-base-api';

export type AccountingEndpointBuilder = Parameters<
  Parameters<typeof accountingBaseApi.injectEndpoints>[0]['endpoints']
>[0];
