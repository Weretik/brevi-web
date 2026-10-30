import { customApiError } from '../../errors/custom-sewing/custom-api-error';
import {
  mapCustomDetail,
  mapCustomVersion,
} from '../../mappers/custom-sewing/custom-detail.mapper';
import {
  quoteArray,
  quoteId,
  quoteInteger,
  quoteRecord,
  quoteText,
} from '../../validators/quotes/quote-response-values';

import type { CustomEndpointBuilder } from './custom-endpoint-builder';
import type { CustomDetail, CustomVersion, CustomVersionPage } from '@admin/clients/model';

export function customQueries(build: CustomEndpointBuilder) {
  return {
    getCustomSewing: build.query<CustomDetail, string>({
      query: (id) => `/api/crm/custom-sewing/${encodeURIComponent(id)}`,
      transformResponse: mapCustomDetail,
      transformErrorResponse: customApiError,
      providesTags: (_r, _e, id) => [{ type: 'CustomSewing', id }],
    }),
    getCustomSewingVersion: build.query<CustomVersion, { id: string; versionId: string }>({
      query: ({ id, versionId }) =>
        `/api/crm/custom-sewing/${encodeURIComponent(id)}/versions/${encodeURIComponent(versionId)}`,
      transformResponse: mapCustomVersion,
      transformErrorResponse: customApiError,
      providesTags: (_r, _e, { id }) => [{ type: 'CustomSewing', id }],
    }),
    getCustomSewingVersions: build.query<CustomVersionPage, { id: string; page: number }>({
      query: ({ id, page }) => ({
        url: `/api/crm/custom-sewing/${encodeURIComponent(id)}/versions`,
        params: { page, pageSize: 25 },
      }),
      transformResponse: (value: unknown) => {
        const response = quoteRecord(value);
        const page = quoteRecord(response['pagedInfo']);
        return {
          rows: quoteArray(response['value'], 25).map((entry) => {
            const row = quoteRecord(entry);
            return {
              id: quoteId(row['publicId']),
              number: quoteInteger(row['number']),
              name: quoteText(row['name']),
            };
          }),
          page: quoteInteger(page['pageNumber']),
          totalPages: quoteInteger(page['totalPages'], 0),
        };
      },
      transformErrorResponse: customApiError,
      providesTags: (_r, _e, { id }) => [{ type: 'CustomSewing', id }],
    }),
  };
}
