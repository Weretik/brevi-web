import { redirectsTag } from '../../cache/redirect-tags';
import { redirectApiError } from '../../errors/redirect-api-error';
import {
  mapRedirect,
  mapRedirectImportReport,
  mapRedirectList,
} from '../../mappers/redirects/redirect.mapper';

import type { ContentEndpointBuilder } from '../content-endpoint-builder';
import type {
  OldSiteImportItems,
  RedirectImportReport,
  SiteRedirect,
  SiteRedirectInput,
} from '@admin/content/model';
import type { operations } from '@admin/shared/contracts';

type SaveBody = operations['saveSiteRedirect']['requestBody']['content']['application/json'];
type ImportBody =
  operations['importOldSiteRedirects']['requestBody']['content']['application/json'];

export function redirectEndpoints(build: ContentEndpointBuilder) {
  return {
    getSiteRedirects: build.query<SiteRedirect[], void>({
      query: () => ({ url: '/api/content/redirects' }),
      transformResponse: mapRedirectList,
      transformErrorResponse: redirectApiError,
      providesTags: [redirectsTag],
    }),
    /** Adds a redirect when `id` is null, otherwise changes it. */
    saveSiteRedirect: build.mutation<SiteRedirect, SiteRedirectInput>({
      query: ({ id, ...input }) => ({
        url: id === null ? '/api/content/redirects' : `/api/content/redirects/${id}`,
        method: id === null ? 'POST' : 'PUT',
        body: input satisfies SaveBody,
      }),
      transformResponse: mapRedirect,
      transformErrorResponse: redirectApiError,
      invalidatesTags: [redirectsTag],
    }),
    deleteSiteRedirect: build.mutation<void, number>({
      query: (id) => ({ url: `/api/content/redirects/${id}`, method: 'DELETE' }),
      transformErrorResponse: redirectApiError,
      invalidatesTags: [redirectsTag],
    }),
    /** Transfer of the old-site addresses: a check (`dryRun`) or the transfer. */
    importOldSiteRedirects: build.mutation<
      RedirectImportReport,
      { items: OldSiteImportItems; dryRun: boolean; overwrite: boolean }
    >({
      query: ({ items, dryRun, overwrite }) => ({
        url: '/api/content/redirects/old-site-import',
        method: 'POST',
        // The file is passed as it is; the server checks every address.
        body: { items: items as unknown as ImportBody['items'], dryRun, overwrite },
      }),
      transformResponse: mapRedirectImportReport,
      transformErrorResponse: redirectApiError,
      invalidatesTags: (report) => (report && !report.dryRun ? [redirectsTag] : []),
    }),
  };
}
