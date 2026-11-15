import { apiCall, apiClient } from '@admin/shared/api-client';

import { redirectsTag } from '../../cache/redirect-tags';
import { redirectApiError } from '../../errors/publishing/redirect-api-error';
import {
  mapRedirect,
  mapRedirectImportReport,
  mapRedirectList,
} from '../../mappers/redirects/redirect.mapper';

import type { ContentEndpointBuilder } from '../base/content-endpoint-builder';
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
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/content/redirects', { signal }),
          mapRedirectList,
          redirectApiError,
        ),
      providesTags: [redirectsTag],
    }),
    /** Adds a redirect when `id` is null, otherwise changes it. */
    saveSiteRedirect: build.mutation<SiteRedirect, SiteRedirectInput>({
      queryFn: ({ id, ...input }, { signal }) =>
        apiCall(
          id === null
            ? apiClient.POST('/api/content/redirects', { body: input satisfies SaveBody, signal })
            : apiClient.PUT('/api/content/redirects/{id}', {
                params: { path: { id } },
                body: input satisfies SaveBody,
                signal,
              }),
          mapRedirect,
          redirectApiError,
        ),
      invalidatesTags: [redirectsTag],
    }),
    deleteSiteRedirect: build.mutation<void, number>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.DELETE('/api/content/redirects/{id}', { params: { path: { id: id } }, signal }),
          undefined,
          redirectApiError,
        ),
      invalidatesTags: [redirectsTag],
    }),
    /** Transfer of the old-site addresses: a check (`dryRun`) or the transfer. */
    importOldSiteRedirects: build.mutation<
      RedirectImportReport,
      { items: OldSiteImportItems; dryRun: boolean; overwrite: boolean }
    >({
      queryFn: ({ items, dryRun, overwrite }, { signal }) =>
        apiCall(
          apiClient.POST('/api/content/redirects/old-site-import', {
            body: { items: items as unknown as ImportBody['items'], dryRun, overwrite },
            signal,
          }),
          mapRedirectImportReport,
          redirectApiError,
        ),
      invalidatesTags: (report) => (report && !report.dryRun ? [redirectsTag] : []),
    }),
  };
}
