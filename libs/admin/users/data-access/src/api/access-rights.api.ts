import { adminApi, apiCall, apiClient } from '@admin/shared/api-client';

import {
  mapAccessRights,
  mapAccessRole,
  mapCreatedRole,
  toSaveRoleAccessBody,
} from '../mappers/access-rights.mapper';

import type { components } from '@admin/shared/contracts';
import type { AccessGrants, AccessRights, AccessRole } from '@admin/users/model';

type CreateRoleBody = components['schemas']['CreateRoleRequest'];

export interface SaveRoleAccessInput {
  role: string;
  version: number;
  grants: AccessGrants;
}

/** «Права доступу»: pages, roles and their grants. Changes also refresh the users-page role list. */
export const accessRightsApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getAccessRights: build.query<AccessRights, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(apiClient.GET('/api/admin/access', { signal }), mapAccessRights),
      providesTags: ['AccessRights'],
    }),
    saveRoleAccess: build.mutation<AccessRole, SaveRoleAccessInput>({
      queryFn: ({ role, version, grants }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/admin/access/roles/{role}', {
            params: { path: { role: role } },
            body: toSaveRoleAccessBody(version, grants),
            signal,
          }),
          mapAccessRole,
        ),
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
      queryFn: (title, { signal }) =>
        apiCall(
          apiClient.POST('/api/admin/access/roles', {
            body: { title: title.trim() } satisfies CreateRoleBody,
            signal,
          }),
          mapCreatedRole,
        ),
      invalidatesTags: ['AccessRights'],
    }),
    deleteRole: build.mutation<void, string>({
      queryFn: (role, { signal }) =>
        apiCall(
          apiClient.DELETE('/api/admin/access/roles/{role}', {
            params: { path: { role: role } },
            signal,
          }),
        ),
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
