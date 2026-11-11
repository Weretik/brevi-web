import { sitePageApiError } from '../../errors/site-page-api-error';
import { mapSitePage, mapSitePages } from '../../mappers/site-pages/site-page.mapper';

import type { ContentEndpointBuilder } from '../content-endpoint-builder';
import type { SitePage, SitePageInput } from '@admin/content/model';
import type { operations } from '@admin/shared/contracts';

type SaveBody = operations['saveSitePage']['requestBody']['content']['application/json'];

const tag = { type: 'SitePages' as const, id: 'LIST' };

export function sitePageEndpoints(build: ContentEndpointBuilder) {
  return {
    getSitePages: build.query<SitePage[], void>({
      query: () => ({ url: '/api/content/site-pages' }),
      transformResponse: mapSitePages,
      transformErrorResponse: sitePageApiError,
      providesTags: [tag],
    }),
    saveSitePage: build.mutation<SitePage, SitePageInput>({
      query: ({ key, revision, texts }) => ({
        url: `/api/content/site-pages/${encodeURIComponent(key)}`,
        method: 'PUT',
        body: { revision, uk: texts.uk, ru: texts.ru } satisfies SaveBody,
      }),
      transformResponse: mapSitePage,
      transformErrorResponse: sitePageApiError,
      // A stale revision means someone else saved: reload either way.
      invalidatesTags: [tag],
    }),
  };
}
