import { apiCall, apiClient } from '@admin/shared/api-client';

import { mapSeoOverview } from '../../mappers/seo-overview/seo-overview.mapper';

import type { ContentEndpointBuilder } from '../base/content-endpoint-builder';
import type { SeoOverview } from '@admin/content/model';

export function seoOverviewEndpoints(build: ContentEndpointBuilder) {
  return {
    // Read-only and computed from every «Контент» section, so the page refetches on each visit.
    getSeoOverview: build.query<SeoOverview, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(apiClient.GET('/api/content/seo-overview', { signal }), mapSeoOverview),
    }),
  };
}
