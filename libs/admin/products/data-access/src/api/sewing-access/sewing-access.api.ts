import { adminApi } from '@admin/shared/api-client';

import { mapSewingAccess } from '../../mappers/sewing-access/sewing-access.mapper';
import { sewingCompositionError } from '../sewing-composition/sewing-composition.errors';

import type { SewingAccess } from '../../models/sewing-access/sewing-access';

export const sewingAccessApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getSewingAccess: build.query<SewingAccess, void>({
      query: () => '/api/auth/session/me',
      transformResponse: mapSewingAccess,
      transformErrorResponse: sewingCompositionError,
    }),
  }),
});
export const { useGetSewingAccessQuery } = sewingAccessApi;
