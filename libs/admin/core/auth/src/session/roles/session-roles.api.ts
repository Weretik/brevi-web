import { adminApi, apiCall, apiClient } from '@admin/shared/api-client';

import { mapSessionRoles } from './session-roles';

/** Server roles of the signed-in user, for features that check access through RTK Query. */
export const sessionRolesApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminSessionRoles: build.query<readonly string[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(apiClient.GET('/api/auth/session/me', { signal }), mapSessionRoles),
    }),
  }),
});

export const { useGetAdminSessionRolesQuery } = sessionRolesApi;
