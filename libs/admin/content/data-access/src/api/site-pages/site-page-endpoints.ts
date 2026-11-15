import { apiCall, apiClient } from '@admin/shared/api-client';

import { sitePageApiError } from '../../errors/site/site-page-api-error';
import { mapSitePage, mapSitePages } from '../../mappers/site-pages/site-page.mapper';

import type { ContentEndpointBuilder } from '../base/content-endpoint-builder';
import type { SitePage, SitePageInput } from '@admin/content/model';
import type { operations } from '@admin/shared/contracts';

type SaveBody = operations['saveSitePage']['requestBody']['content']['application/json'];

const tag = { type: 'SitePages' as const, id: 'LIST' };

export function sitePageEndpoints(build: ContentEndpointBuilder) {
  return {
    getSitePages: build.query<SitePage[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/content/site-pages', { signal }),
          mapSitePages,
          sitePageApiError,
        ),
      providesTags: [tag],
    }),
    saveSitePage: build.mutation<SitePage, SitePageInput>({
      queryFn: ({ key, revision, texts }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/content/site-pages/{key}', {
            params: { path: { key: key } },
            body: { revision, uk: texts.uk, ru: texts.ru } satisfies SaveBody,
            signal,
          }),
          mapSitePage,
          sitePageApiError,
        ),
      // A stale revision means someone else saved: reload either way.
      invalidatesTags: [tag],
    }),
  };
}
