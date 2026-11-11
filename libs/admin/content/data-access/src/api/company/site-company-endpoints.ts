import { siteCompanyApiError } from '../../errors/site-company-api-error';
import { mapSiteCompany } from '../../mappers/company/site-company.mapper';

import type { ContentEndpointBuilder } from '../content-endpoint-builder';
import type { SiteCompany, SiteCompanyInput } from '@admin/content/model';
import type { operations } from '@admin/shared/contracts';

type SaveBody = operations['saveSiteCompany']['requestBody']['content']['application/json'];

const tag = { type: 'SiteCompany' as const, id: 'ONE' };

export function siteCompanyEndpoints(build: ContentEndpointBuilder) {
  return {
    getSiteCompany: build.query<SiteCompany, void>({
      query: () => ({ url: '/api/content/company' }),
      transformResponse: mapSiteCompany,
      transformErrorResponse: siteCompanyApiError,
      providesTags: [tag],
    }),
    saveSiteCompany: build.mutation<SiteCompany, SiteCompanyInput>({
      query: (input) => ({
        url: '/api/content/company',
        method: 'PUT',
        body: input satisfies SaveBody,
      }),
      transformResponse: mapSiteCompany,
      transformErrorResponse: siteCompanyApiError,
      // A stale revision means someone else saved: reload either way.
      invalidatesTags: [tag],
    }),
  };
}
