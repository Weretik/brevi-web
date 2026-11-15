import { apiCall, apiClient } from '@admin/shared/api-client';

import { siteGalleryApiError } from '../../errors/site/site-gallery-api-error';
import {
  mapSiteGallery,
  mapSiteGalleryTransfer,
} from '../../mappers/galleries/site-gallery.mapper';

import type { ContentEndpointBuilder } from '../base/content-endpoint-builder';
import type {
  SiteGallery,
  SiteGalleryInput,
  SiteGalleryKind,
  SiteGalleryTransfer,
} from '@admin/content/model';
import type { operations } from '@admin/shared/contracts';

type SaveBody = operations['saveSiteWorks']['requestBody']['content']['application/json'];

const tag = (kind: SiteGalleryKind) => ({ type: 'SiteGallery' as const, id: kind });

/** «Наші роботи» (`/api/content/works`) and «Сертифікати» (`/api/content/certificates`). */
export function siteGalleryEndpoints(build: ContentEndpointBuilder) {
  return {
    getSiteGallery: build.query<SiteGallery, SiteGalleryKind>({
      queryFn: (kind, { signal }) =>
        apiCall(
          kind === 'works'
            ? apiClient.GET('/api/content/works', { signal })
            : apiClient.GET('/api/content/certificates', { signal }),
          mapSiteGallery,
          siteGalleryApiError,
        ),
      providesTags: (_result, _error, kind) => [tag(kind)],
    }),
    saveSiteGallery: build.mutation<SiteGallery, SiteGalleryInput>({
      queryFn: ({ kind, revision, items }, { signal }) => {
        const body = { revision, items } satisfies SaveBody;
        return apiCall(
          kind === 'works'
            ? apiClient.PUT('/api/content/works', { body, signal })
            : apiClient.PUT('/api/content/certificates', { body, signal }),
          mapSiteGallery,
          siteGalleryApiError,
        );
      },
      // A stale revision means someone else saved: reload either way.
      invalidatesTags: (_result, _error, input) => [tag(input.kind)],
    }),
    transferSiteGallery: build.mutation<SiteGalleryTransfer, SiteGalleryKind>({
      queryFn: (kind, { signal }) =>
        apiCall(
          kind === 'works'
            ? apiClient.POST('/api/content/works/transfer', { signal })
            : apiClient.POST('/api/content/certificates/transfer', { signal }),
          mapSiteGalleryTransfer,
          siteGalleryApiError,
        ),
      invalidatesTags: (_result, _error, kind) => [tag(kind)],
    }),
  };
}
