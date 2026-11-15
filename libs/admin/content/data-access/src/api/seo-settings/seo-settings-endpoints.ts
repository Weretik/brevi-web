import { apiCall, apiClient } from '@admin/shared/api-client';

import { seoSettingsApiError } from '../../errors/publishing/seo-settings-api-error';
import { mapSeoSettings } from '../../mappers/seo-settings/seo-settings.mapper';

import type { ContentEndpointBuilder } from '../base/content-endpoint-builder';
import type { SeoSettings, SeoSettingsInput } from '@admin/content/model';
import type { operations } from '@admin/shared/contracts';

type SaveBody = operations['saveSiteSeoSettings']['requestBody']['content']['application/json'];

const tag = { type: 'SiteSeoSettings' as const, id: 'ONE' };

export function seoSettingsEndpoints(build: ContentEndpointBuilder) {
  return {
    getSiteSeoSettings: build.query<SeoSettings, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/content/seo-settings', { signal }),
          mapSeoSettings,
          seoSettingsApiError,
        ),
      providesTags: [tag],
    }),
    saveSiteSeoSettings: build.mutation<SeoSettings, SeoSettingsInput>({
      queryFn: (input, { signal }) =>
        apiCall(
          apiClient.PUT('/api/content/seo-settings', { body: input satisfies SaveBody, signal }),
          mapSeoSettings,
          seoSettingsApiError,
        ),
      // A stale revision means someone else saved: reload either way.
      invalidatesTags: [tag],
    }),
  };
}
