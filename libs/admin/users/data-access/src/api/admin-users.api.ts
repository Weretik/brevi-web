import { adminApi } from '@admin/shared/api-client';

import { mapStaffAccount, mapStaffAccounts } from '../mappers/staff-account.mapper';

import type { components } from '@admin/shared/contracts';
import type { CreateStaffAccountInput, StaffAccount, StaffRole } from '@admin/users/model';

type CreateStaffAccountBody = components['schemas']['CreateStaffAccountRequest'];

const root = '/api/admin/users';
const userUrl = (userId: number, action: string) => `${root}/${userId}/${action}`;

export const adminUsersApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getStaffAccounts: build.query<StaffAccount[], void>({
      query: () => ({ url: root, method: 'GET' }),
      transformResponse: mapStaffAccounts,
      providesTags: ['StaffAccount'],
    }),
    createStaffAccount: build.mutation<StaffAccount, CreateStaffAccountInput>({
      query: (input) => ({
        url: root,
        method: 'POST',
        body: {
          email: input.email.trim(),
          fullName: input.fullName.trim(),
          role: input.role,
          password: input.password,
        } satisfies CreateStaffAccountBody,
      }),
      transformResponse: mapStaffAccount,
      invalidatesTags: ['StaffAccount'],
    }),
    changeStaffRole: build.mutation<void, { userId: number; role: StaffRole }>({
      query: ({ userId, role }) => ({
        url: userUrl(userId, 'role'),
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: ['StaffAccount'],
    }),
    setStaffBlocked: build.mutation<void, { userId: number; blocked: boolean }>({
      query: ({ userId, blocked }) => ({
        url: userUrl(userId, 'blocked'),
        method: 'PUT',
        body: { blocked },
      }),
      invalidatesTags: ['StaffAccount'],
    }),
    setStaffPassword: build.mutation<void, { userId: number; password: string }>({
      query: ({ userId, password }) => ({
        url: userUrl(userId, 'password'),
        method: 'PUT',
        body: { password },
      }),
    }),
    deleteStaffAccount: build.mutation<void, number>({
      query: (userId) => ({ url: `${root}/${userId}`, method: 'DELETE' }),
      invalidatesTags: ['StaffAccount'],
    }),
  }),
});

export const {
  useChangeStaffRoleMutation,
  useCreateStaffAccountMutation,
  useDeleteStaffAccountMutation,
  useGetStaffAccountsQuery,
  useSetStaffBlockedMutation,
  useSetStaffPasswordMutation,
} = adminUsersApi;
