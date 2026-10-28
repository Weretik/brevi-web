import type { quoteBaseApi } from './quote-base-api';

export type QuoteEndpointBuilder = Parameters<
  Parameters<typeof quoteBaseApi.injectEndpoints>[0]['endpoints']
>[0];
