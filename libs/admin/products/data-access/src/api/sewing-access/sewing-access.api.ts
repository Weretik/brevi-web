import { adminApi } from '@admin/shared/api-client';

import { mapSewingAccess } from '../../mappers/sewing-access/sewing-access.mapper';
import { sewingCompositionError } from '../sewing-composition/sewing-composition.errors';

import type { SewingAccess } from '../../models/sewing-access/sewing-access';

export const sewingAccessApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getSewingAccess: build.query<SewingAccess, void>({
      async queryFn(_arg, _api, _extra, baseQuery) {
        const response = await baseQuery('/api/auth/session/me');
        if (response.error) return { error: sewingCompositionError(response.error) };
        return { data: mapSewingAccess(response.data) };
      },
    }),
  }),
});
export const { useGetSewingAccessQuery } = sewingAccessApi;
