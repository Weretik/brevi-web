import { adminApi, apiCall, apiClient } from '@admin/shared/api-client';

import {
  mapStaffAccount,
  mapStaffAccounts,
  mapStaffRoleOptions,
} from '../mappers/staff-account.mapper';
import { toPhoneBody } from '../mappers/staff-profile.mapper';

import type { components } from '@admin/shared/contracts';
import type {
  CreateStaffAccountInput,
  StaffAccount,
  StaffDetailsInput,
  StaffRole,
  StaffRoleOption,
} from '@admin/users/model';

type CreateStaffAccountBody = components['schemas']['CreateStaffAccountRequest'];
type UpdateStaffDetailsBody = components['schemas']['UpdateStaffDetailsRequest'];

export const adminUsersApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getStaffAccounts: build.query<StaffAccount[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(apiClient.GET('/api/admin/users', { signal }), mapStaffAccounts),
      providesTags: ['StaffAccount'],
    }),
    /** Assignable roles with their titles; «Права доступу» invalidates 'AccessRights' on change. */
    getStaffRoleOptions: build.query<StaffRoleOption[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(apiClient.GET('/api/admin/access', { signal }), mapStaffRoleOptions),
      providesTags: ['AccessRights'],
    }),
    createStaffAccount: build.mutation<StaffAccount, CreateStaffAccountInput>({
      queryFn: (input, { signal }) =>
        apiCall(
          apiClient.POST('/api/admin/users', {
            body: {
              email: input.email.trim(),
              fullName: input.fullName.trim(),
              role: input.role,
              password: input.password,
              phoneNumber: toPhoneBody(input.phoneNumber),
            } satisfies CreateStaffAccountBody,
            signal,
          }),
          mapStaffAccount,
        ),
      invalidatesTags: ['StaffAccount'],
    }),
    updateStaffDetails: build.mutation<void, { userId: number; details: StaffDetailsInput }>({
      queryFn: ({ userId, details }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/admin/users/{userId}/details', {
            params: { path: { userId: userId } },
            body: {
              fullName: details.fullName.trim(),
              email: details.email.trim(),
              phoneNumber: toPhoneBody(details.phoneNumber),
            } satisfies UpdateStaffDetailsBody,
            signal,
          }),
        ),
      // The signed-in admin may edit their own row, which their profile also shows.
      invalidatesTags: ['StaffAccount', 'StaffProfile'],
    }),
    changeStaffRole: build.mutation<void, { userId: number; role: StaffRole }>({
      queryFn: ({ userId, role }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/admin/users/{userId}/role', {
            params: { path: { userId: userId } },
            body: { role },
            signal,
          }),
        ),
      invalidatesTags: ['StaffAccount'],
    }),
    setStaffBlocked: build.mutation<void, { userId: number; blocked: boolean }>({
      queryFn: ({ userId, blocked }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/admin/users/{userId}/blocked', {
            params: { path: { userId: userId } },
            body: { blocked },
            signal,
          }),
        ),
      invalidatesTags: ['StaffAccount'],
    }),
    setStaffPassword: build.mutation<void, { userId: number; password: string }>({
      queryFn: ({ userId, password }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/admin/users/{userId}/password', {
            params: { path: { userId: userId } },
            body: { password },
            signal,
          }),
        ),
    }),
    deleteStaffAccount: build.mutation<void, number>({
      queryFn: (userId, { signal }) =>
        apiCall(
          apiClient.DELETE('/api/admin/users/{userId}', {
            params: { path: { userId: userId } },
            signal,
          }),
        ),
      invalidatesTags: ['StaffAccount'],
    }),
  }),
});

export const {
  useChangeStaffRoleMutation,
  useCreateStaffAccountMutation,
  useDeleteStaffAccountMutation,
  useGetStaffAccountsQuery,
  useGetStaffRoleOptionsQuery,
  useSetStaffBlockedMutation,
  useSetStaffPasswordMutation,
  useUpdateStaffDetailsMutation,
} = adminUsersApi;
