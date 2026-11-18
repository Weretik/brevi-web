import { apiCall, apiClient, formDataBody } from '@admin/shared/api-client';

import { quoteLookupErrors, quotePhotoErrors, toQuoteApiError } from '../../errors/quote-api-error';
import {
  mapQuoteCatalogPage,
  mapQuoteCustomSewingPrice,
  mapQuoteFabricFacts,
  mapQuoteModelComposition,
  mapQuoteProductPhotos,
  mapQuoteStaff,
} from '../../mappers/quote-catalog.mapper';
import { quotesBaseApi } from '../base/quotes-base-api';

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
      queryFn: ({ kind, search, season, page, pageSize }, { signal }) =>
        apiCall(
          apiClient.GET('/api/crm/quote-lookups/catalog', {
            params: { query: { kind, search: search.trim() || undefined, season, page, pageSize } },
            signal,
          }),
          mapQuoteCatalogPage,
          (response) => toQuoteApiError(response, quoteLookupErrors),
        ),
    }),
    /** «Виріб з нуля» or a model in another fabric: the price of each variant by the Catalog formula; nothing is saved. */
    calculateQuoteCustomSewing: build.mutation<
      QuoteCustomSewingPrice,
      QuoteCustomSewingPriceRequest
    >({
      queryFn: (body, { signal }) =>
        apiCall(
          apiClient.POST('/api/crm/quote-lookups/custom-sewing-price', {
            body: {
              variants: body.variants.map((variant) => ({ fabrics: [...variant.fabrics] })),
              lines: [...body.lines],
            },
            signal,
          }),
          mapQuoteCustomSewingPrice,
          (response) => toQuoteApiError(response, quoteLookupErrors),
        ),
    }),
    /** «Змінити склад»: the Catalog composition of a sewing model to start from. */
    getQuoteModelComposition: build.query<QuoteModelComposition, number>({
      queryFn: (productId, { signal }) =>
        apiCall(
          apiClient.GET('/api/crm/quote-lookups/catalog/{productId}/composition', {
            params: { path: { productId: productId } },
            signal,
          }),
          mapQuoteModelComposition,
          (response) => toQuoteApiError(response, quoteLookupErrors),
        ),
    }),
    /** «Змінити фото»: the photos of the product's card tab «Фото», main first. */
    getQuoteProductPhotos: build.query<QuoteProductPhoto[], number>({
      queryFn: (productId, { signal }) =>
        apiCall(
          apiClient.GET('/api/v1/products/{id}/photos', {
            params: { path: { id: productId } },
            signal,
          }),
          mapQuoteProductPhotos,
          (response) => toQuoteApiError(response, quoteLookupErrors),
        ),
    }),
    /** The manager line under each КП fabric: composition, density, price per metre, supplier (R-31). */
    getQuoteFabricFacts: build.query<QuoteFabricFacts[], readonly number[]>({
      queryFn: (ids, { signal }) =>
        apiCall(
          apiClient.GET('/api/crm/quote-lookups/fabrics', {
            params: { query: { ids: [...ids] } },
            signal,
          }),
          mapQuoteFabricFacts,
          (response) => toQuoteApiError(response, quoteLookupErrors),
        ),
    }),
    getQuoteStaff: build.query<QuoteStaff[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/crm/quote-lookups/staff', { signal }),
          mapQuoteStaff,
          (response) => toQuoteApiError(response, quoteLookupErrors),
        ),
    }),
    /** «Змінити фото → Завантажити своє»: the photo goes to the CDN folder «Фото КП» (crm R-34). */
    uploadQuotePhoto: build.mutation<string, File>({
      queryFn: (file, { signal }) =>
        apiCall(
          apiClient.POST('/api/crm/quote-lookups/photos', { ...formDataBody({ file }), signal }),
          (value) => value.url,
          (response) => toQuoteApiError(response, quotePhotoErrors),
        ),
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
  useUploadQuotePhotoMutation,
} = quoteLookupsApi;
