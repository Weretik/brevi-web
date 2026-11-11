import { seoSettingsApiError } from '../../errors/seo-settings-api-error';
import { mapSeoSettings } from '../../mappers/seo-settings/seo-settings.mapper';

import type { ContentEndpointBuilder } from '../content-endpoint-builder';
import type { SeoSettings, SeoSettingsInput } from '@admin/content/model';
import type { operations } from '@admin/shared/contracts';

type SaveBody = operations['saveSiteSeoSettings']['requestBody']['content']['application/json'];

const tag = { type: 'SiteSeoSettings' as const, id: 'ONE' };

export function seoSettingsEndpoints(build: ContentEndpointBuilder) {
  return {
    getSiteSeoSettings: build.query<SeoSettings, void>({
      query: () => ({ url: '/api/content/seo-settings' }),
      transformResponse: mapSeoSettings,
      transformErrorResponse: seoSettingsApiError,
      providesTags: [tag],
    }),
    saveSiteSeoSettings: build.mutation<SeoSettings, SeoSettingsInput>({
      query: (input) => ({
        url: '/api/content/seo-settings',
        method: 'PUT',
        body: input satisfies SaveBody,
      }),
      transformResponse: mapSeoSettings,
      transformErrorResponse: seoSettingsApiError,
      // A stale revision means someone else saved: reload either way.
      invalidatesTags: [tag],
    }),
  };
}
