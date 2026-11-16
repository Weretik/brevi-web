import { adminApi, apiCall, apiClient, formDataBody } from '@admin/shared/api-client';

import { mapStaffProfile, toPhoneBody } from '../mappers/staff-profile.mapper';

import type { components } from '@admin/shared/contracts';
import type { StaffProfile } from '@admin/users/model';

type ChangeOwnEmailBody = components['schemas']['ChangeOwnEmailRequest'];
type ChangeOwnPasswordBody = components['schemas']['ChangeOwnPasswordRequest'];

/** The users table shows names and photos, so own changes refresh it too. */
const afterChange = ['StaffProfile', 'StaffAccount'] as const;

export const profileApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getMyProfile: build.query<StaffProfile, void>({
      queryFn: (_arg, { signal }) =>
        apiCall(apiClient.GET('/api/profile', { signal }), mapStaffProfile),
      providesTags: ['StaffProfile'],
    }),
    changeMyName: build.mutation<void, string>({
      queryFn: (fullName, { signal }) =>
        apiCall(
          apiClient.PUT('/api/profile/name', { body: { fullName: fullName.trim() }, signal }),
        ),
      invalidatesTags: [...afterChange],
    }),
    changeMyPhone: build.mutation<void, string>({
      queryFn: (phone, { signal }) =>
        apiCall(
          apiClient.PUT('/api/profile/phone', {
            body: { phoneNumber: toPhoneBody(phone) },
            signal,
          }),
        ),
      invalidatesTags: [...afterChange],
    }),
    uploadMyAvatar: build.mutation<void, File>({
      queryFn: (file, { signal }) =>
        apiCall(
          apiClient.PUT('/api/profile/avatar', { ...formDataBody({ file }), signal }),
          () => undefined,
        ),
      invalidatesTags: [...afterChange],
    }),
    removeMyAvatar: build.mutation<void, void>({
      queryFn: (_arg, { signal }) => apiCall(apiClient.DELETE('/api/profile/avatar', { signal })),
      invalidatesTags: [...afterChange],
    }),
    changeMyEmail: build.mutation<void, ChangeOwnEmailBody>({
      queryFn: ({ currentPassword, email }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/profile/email', {
            body: { email: email.trim(), currentPassword } satisfies ChangeOwnEmailBody,
            signal,
          }),
        ),
      invalidatesTags: [...afterChange],
    }),
    changeMyPassword: build.mutation<void, ChangeOwnPasswordBody>({
      queryFn: (body, { signal }) =>
        apiCall(apiClient.PUT('/api/profile/password', { body: body, signal })),
    }),
  }),
});

export const {
  useChangeMyEmailMutation,
  useChangeMyNameMutation,
  useChangeMyPasswordMutation,
  useChangeMyPhoneMutation,
  useGetMyProfileQuery,
  useRemoveMyAvatarMutation,
  useUploadMyAvatarMutation,
} = profileApi;
