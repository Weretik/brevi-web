import { quotesBaseApi } from './quotes-base-api';
import { quoteLookupErrors, toQuoteApiError } from '../errors/quote-api-error';
import {
  mapQuoteCatalogPage,
  mapQuoteCustomSewingPrice,
  mapQuoteFabricFacts,
  mapQuoteModelComposition,
  mapQuoteProductPhotos,
  mapQuoteStaff,
} from '../mappers/quote.mapper';

import type {
  QuoteCatalogPage,
  QuoteCustomSewingPrice,
  QuoteCustomSewingPriceRequest,
  QuoteFabricFacts,
  QuoteIntroSeason,
  QuoteModelComposition,
  QuoteProductPhoto,
  QuoteStaff,
} from '@admin/quotes/model';

export interface QuoteCatalogQuery {
  readonly kind: 'Sewing' | 'Ppe';
  readonly search: string;
  /** Only sewing models of this season (introduction pages). */
  readonly season?: QuoteIntroSeason;
  readonly page: number;
  readonly pageSize: number;
}

export const quoteLookupsApi = quotesBaseApi.injectEndpoints({
  endpoints: (build) => ({
    searchQuoteCatalog: build.query<QuoteCatalogPage, QuoteCatalogQuery>({
      query: ({ kind, search, season, page, pageSize }) => ({
        url: '/api/crm/quote-lookups/catalog',
        params: { kind, search: search.trim() || undefined, season, page, pageSize },
      }),
      transformResponse: mapQuoteCatalogPage,
      transformErrorResponse: (response) => toQuoteApiError(response, quoteLookupErrors),
    }),
    /** «Виріб з нуля» or a model in another fabric: the price of each variant by the Catalog formula; nothing is saved. */
    calculateQuoteCustomSewing: build.mutation<
      QuoteCustomSewingPrice,
      QuoteCustomSewingPriceRequest
    >({
      query: (body) => ({
        url: '/api/crm/quote-lookups/custom-sewing-price',
        method: 'POST',
        body,
      }),
      transformResponse: mapQuoteCustomSewingPrice,
      transformErrorResponse: (response) => toQuoteApiError(response, quoteLookupErrors),
    }),
    /** «Змінити склад»: the Catalog composition of a sewing model to start from. */
    getQuoteModelComposition: build.query<QuoteModelComposition, number>({
      query: (productId) => `/api/crm/quote-lookups/catalog/${productId}/composition`,
      transformResponse: mapQuoteModelComposition,
      transformErrorResponse: (response) => toQuoteApiError(response, quoteLookupErrors),
    }),
    /** «Змінити фото»: the photos of the product's card tab «Фото», main first. */
    getQuoteProductPhotos: build.query<QuoteProductPhoto[], number>({
      query: (productId) => `/api/v1/products/${productId}/photos`,
      transformResponse: mapQuoteProductPhotos,
      transformErrorResponse: (response) => toQuoteApiError(response, quoteLookupErrors),
    }),
    /** The manager line under each КП fabric: composition, density, price per metre, supplier (R-31). */
    getQuoteFabricFacts: build.query<QuoteFabricFacts[], readonly number[]>({
      query: (ids) => ({ url: '/api/crm/quote-lookups/fabrics', params: { ids: [...ids] } }),
      transformResponse: mapQuoteFabricFacts,
      transformErrorResponse: (response) => toQuoteApiError(response, quoteLookupErrors),
    }),
    getQuoteStaff: build.query<QuoteStaff[], void>({
      query: () => '/api/crm/quote-lookups/staff',
      transformResponse: mapQuoteStaff,
      transformErrorResponse: (response) => toQuoteApiError(response, quoteLookupErrors),
    }),
  }),
});

export const {
  useCalculateQuoteCustomSewingMutation,
  useGetQuoteFabricFactsQuery,
  useGetQuoteModelCompositionQuery,
  useGetQuoteProductPhotosQuery,
  useSearchQuoteCatalogQuery,
  useGetQuoteStaffQuery,
} = quoteLookupsApi;
