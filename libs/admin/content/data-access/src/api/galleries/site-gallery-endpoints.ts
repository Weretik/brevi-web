import { siteGalleryApiError } from '../../errors/site-gallery-api-error';
import {
  mapSiteGallery,
  mapSiteGalleryTransfer,
} from '../../mappers/galleries/site-gallery.mapper';

import type { ContentEndpointBuilder } from '../content-endpoint-builder';
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
      query: (kind) => ({ url: `/api/content/${kind}` }),
      transformResponse: mapSiteGallery,
      transformErrorResponse: siteGalleryApiError,
      providesTags: (_result, _error, kind) => [tag(kind)],
    }),
    saveSiteGallery: build.mutation<SiteGallery, SiteGalleryInput>({
      query: ({ kind, revision, items }) => ({
        url: `/api/content/${kind}`,
        method: 'PUT',
        body: { revision, items } satisfies SaveBody,
      }),
      transformResponse: mapSiteGallery,
      transformErrorResponse: siteGalleryApiError,
      // A stale revision means someone else saved: reload either way.
      invalidatesTags: (_result, _error, input) => [tag(input.kind)],
    }),
    transferSiteGallery: build.mutation<SiteGalleryTransfer, SiteGalleryKind>({
      query: (kind) => ({ url: `/api/content/${kind}/transfer`, method: 'POST' }),
      transformResponse: mapSiteGalleryTransfer,
      transformErrorResponse: siteGalleryApiError,
      invalidatesTags: (_result, _error, kind) => [tag(kind)],
    }),
  };
}
