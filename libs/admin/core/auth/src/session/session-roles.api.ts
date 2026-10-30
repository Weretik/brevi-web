import { adminApi } from '@admin/shared/api-client';

import { mapSessionRoles } from './session-roles';

export const sessionRolesApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminSessionRoles: build.query<readonly string[], void>({
      query: () => '/api/auth/session/me',
      transformResponse: mapSessionRoles,
    }),
  }),
});

export const { useGetAdminSessionRolesQuery } = sessionRolesApi;
