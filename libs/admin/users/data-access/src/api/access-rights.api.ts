import { adminApi } from '@admin/shared/api-client';

import {
  mapAccessRights,
  mapAccessRole,
  mapCreatedRole,
  toSaveRoleAccessBody,
} from '../mappers/access-rights.mapper';

import type { components } from '@admin/shared/contracts';
import type { AccessGrants, AccessRights, AccessRole } from '@admin/users/model';

type CreateRoleBody = components['schemas']['CreateRoleRequest'];

const root = '/api/admin/access';
const roleUrl = (role: string) => `${root}/roles/${encodeURIComponent(role)}`;

export interface SaveRoleAccessInput {
  role: string;
  version: number;
  grants: AccessGrants;
}

/** «Права доступу»: pages, roles and their grants. Changes also refresh the users-page role list. */
export const accessRightsApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getAccessRights: build.query<AccessRights, void>({
      query: () => ({ url: root, method: 'GET' }),
      transformResponse: mapAccessRights,
      providesTags: ['AccessRights'],
    }),
    saveRoleAccess: build.mutation<AccessRole, SaveRoleAccessInput>({
      query: ({ role, version, grants }) => ({
        url: roleUrl(role),
        method: 'PUT',
        body: toSaveRoleAccessBody(version, grants),
      }),
      transformResponse: mapAccessRole,
      // Put the saved role into the cache at once, so the tab does not flash the old grants.
      async onQueryStarted(_input, { dispatch, queryFulfilled }) {
        try {
          const { data: saved } = await queryFulfilled;
          dispatch(
            accessRightsApi.util.updateQueryData('getAccessRights', undefined, (draft) => {
              const index = draft.roles.findIndex((role) => role.name === saved.name);
              if (index >= 0) (draft.roles as AccessRole[])[index] = saved;
            }),
          );
        } catch {
          // The page shows the error from the mutation result.
        }
      },
      invalidatesTags: ['AccessRights'],
    }),
    createRole: build.mutation<{ name: string; title: string }, string>({
      query: (title) => ({
        url: `${root}/roles`,
        method: 'POST',
        body: { title: title.trim() } satisfies CreateRoleBody,
      }),
      transformResponse: mapCreatedRole,
      invalidatesTags: ['AccessRights'],
    }),
    deleteRole: build.mutation<void, string>({
      query: (role) => ({ url: roleUrl(role), method: 'DELETE' }),
      invalidatesTags: ['AccessRights'],
    }),
  }),
});

export const {
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useGetAccessRightsQuery,
  useSaveRoleAccessMutation,
} = accessRightsApi;
