import { quotesBaseApi } from './quotes-base-api';
import { quoteLookupErrors, toQuoteApiError } from '../errors/quote-api-error';
import { mapQuoteCatalogPage, mapQuoteStaff } from '../mappers/quote.mapper';

import type { QuoteCatalogPage, QuoteStaff } from '@admin/quotes/model';

export interface QuoteCatalogQuery {
  readonly kind: 'Sewing' | 'Ppe';
  readonly search: string;
  readonly page: number;
  readonly pageSize: number;
}

export const quoteLookupsApi = quotesBaseApi.injectEndpoints({
  endpoints: (build) => ({
    searchQuoteCatalog: build.query<QuoteCatalogPage, QuoteCatalogQuery>({
      query: ({ kind, search, page, pageSize }) => ({
        url: '/api/crm/quote-lookups/catalog',
        params: { kind, search: search.trim() || undefined, page, pageSize },
      }),
      transformResponse: mapQuoteCatalogPage,
      transformErrorResponse: (response) => toQuoteApiError(response, quoteLookupErrors),
    }),
    getQuoteStaff: build.query<QuoteStaff[], void>({
      query: () => '/api/crm/quote-lookups/staff',
      transformResponse: mapQuoteStaff,
      transformErrorResponse: (response) => toQuoteApiError(response, quoteLookupErrors),
    }),
  }),
});

export const { useSearchQuoteCatalogQuery, useGetQuoteStaffQuery } = quoteLookupsApi;
