import type { contentBaseApi } from './content-base-api';

export type ContentEndpointBuilder = Parameters<
  Parameters<typeof contentBaseApi.injectEndpoints>[0]['endpoints']
>[0];
