import { adminApi, apiCall, apiClient } from '@admin/shared/api-client';

import { mapSewingAccess } from '../../mappers/sewing-access/sewing-access.mapper';
import { sewingCompositionError } from '../sewing-composition/sewing-composition.errors';

import type { SewingAccess } from '../../models/sewing-access/sewing-access';

export const sewingAccessApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getSewingAccess: build.query<SewingAccess, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/auth/session/me', { signal }),
          mapSewingAccess,
          sewingCompositionError,
        ),
    }),
  }),
});
export const { useGetSewingAccessQuery } = sewingAccessApi;
