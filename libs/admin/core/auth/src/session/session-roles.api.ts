import { adminApi } from '@admin/shared/api-client';

import { mapSessionRoles } from './session-roles';

/** Server roles of the signed-in user, for features that check access through RTK Query. */
export const sessionRolesApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminSessionRoles: build.query<readonly string[], void>({
      async queryFn(_arg, _api, _extra, baseQuery) {
        const response = await baseQuery('/api/auth/session/me');
        if (response.error) return { error: response.error };
        return { data: mapSessionRoles(response.data) };
      },
    }),
  }),
});

export const { useGetAdminSessionRolesQuery } = sessionRolesApi;
