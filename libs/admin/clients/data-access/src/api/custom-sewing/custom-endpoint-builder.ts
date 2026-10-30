import type { customBaseApi } from './custom-base-api';

export type CustomEndpointBuilder = Parameters<
  Parameters<typeof customBaseApi.injectEndpoints>[0]['endpoints']
>[0];
