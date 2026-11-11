import { mapSeoOverview } from '../../mappers/seo-overview/seo-overview.mapper';

import type { ContentEndpointBuilder } from '../content-endpoint-builder';
import type { SeoOverview } from '@admin/content/model';

export function seoOverviewEndpoints(build: ContentEndpointBuilder) {
  return {
    // Read-only and computed from every «Контент» section, so the page refetches on each visit.
    getSeoOverview: build.query<SeoOverview, void>({
      query: () => ({ url: '/api/content/seo-overview' }),
      transformResponse: mapSeoOverview,
    }),
  };
}
