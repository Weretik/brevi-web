import type { customerBaseApi } from './customer-base-api';

export type CustomerEndpointBuilder = Parameters<
  Parameters<typeof customerBaseApi.injectEndpoints>[0]['endpoints']
>[0];
