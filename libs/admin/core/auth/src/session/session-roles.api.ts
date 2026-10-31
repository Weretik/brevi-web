import { adminApi } from '@admin/shared/api-client';
import { appConfig } from '@admin/shared/config';

import { mapSessionRoles } from './session-roles';

export const sessionRolesApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminSessionRoles: build.query<readonly string[], void>({
      async queryFn(_arg, _api, _extra, baseQuery) {
        if (appConfig.anonymousAccess) return { data: ['Admin', 'Manager', 'User'] };
        const response = await baseQuery('/api/auth/session/me');
        if (response.error) return { error: response.error };
        return { data: mapSessionRoles(response.data) };
      },
    }),
  }),
});

export const { useGetAdminSessionRolesQuery } = sessionRolesApi;
