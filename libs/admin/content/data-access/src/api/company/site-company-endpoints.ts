import { apiCall, apiClient } from '@admin/shared/api-client';

import { siteCompanyApiError } from '../../errors/site/site-company-api-error';
import { mapSiteCompany } from '../../mappers/company/site-company.mapper';

import type { ContentEndpointBuilder } from '../base/content-endpoint-builder';
import type { SiteCompany, SiteCompanyInput } from '@admin/content/model';
import type { operations } from '@admin/shared/contracts';

type SaveBody = operations['saveSiteCompany']['requestBody']['content']['application/json'];

const tag = { type: 'SiteCompany' as const, id: 'ONE' };

export function siteCompanyEndpoints(build: ContentEndpointBuilder) {
  return {
    getSiteCompany: build.query<SiteCompany, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/content/company', { signal }),
          mapSiteCompany,
          siteCompanyApiError,
        ),
      providesTags: [tag],
    }),
    saveSiteCompany: build.mutation<SiteCompany, SiteCompanyInput>({
      queryFn: (input, { signal }) =>
        apiCall(
          apiClient.PUT('/api/content/company', { body: input satisfies SaveBody, signal }),
          mapSiteCompany,
          siteCompanyApiError,
        ),
      // A stale revision means someone else saved: reload either way.
      invalidatesTags: [tag],
    }),
  };
}
