import { adminApi } from '@admin/shared/api-client';

import { mapStaffProfile, toPhoneBody } from '../mappers/staff-profile.mapper';

import type { components } from '@admin/shared/contracts';
import type { StaffProfile } from '@admin/users/model';

type ChangeOwnEmailBody = components['schemas']['ChangeOwnEmailRequest'];
type ChangeOwnPasswordBody = components['schemas']['ChangeOwnPasswordRequest'];

const root = '/api/profile';
/** The users table shows names and photos, so own changes refresh it too. */
const afterChange = ['StaffProfile', 'StaffAccount'] as const;

export const profileApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getMyProfile: build.query<StaffProfile, void>({
      query: () => ({ url: root, method: 'GET' }),
      transformResponse: mapStaffProfile,
      providesTags: ['StaffProfile'],
    }),
    changeMyName: build.mutation<void, string>({
      query: (fullName) => ({
        url: `${root}/name`,
        method: 'PUT',
        body: { fullName: fullName.trim() },
      }),
      invalidatesTags: [...afterChange],
    }),
    changeMyPhone: build.mutation<void, string>({
      query: (phone) => ({
        url: `${root}/phone`,
        method: 'PUT',
        body: { phoneNumber: toPhoneBody(phone) },
      }),
      invalidatesTags: [...afterChange],
    }),
    uploadMyAvatar: build.mutation<void, File>({
      query: (file) => {
        const body = new FormData();
        body.set('file', file);
        return { url: `${root}/avatar`, method: 'PUT', body };
      },
      invalidatesTags: [...afterChange],
    }),
    removeMyAvatar: build.mutation<void, void>({
      query: () => ({ url: `${root}/avatar`, method: 'DELETE' }),
      invalidatesTags: [...afterChange],
    }),
    changeMyEmail: build.mutation<void, ChangeOwnEmailBody>({
      query: ({ currentPassword, email }) => ({
        url: `${root}/email`,
        method: 'PUT',
        body: { email: email.trim(), currentPassword } satisfies ChangeOwnEmailBody,
      }),
      invalidatesTags: [...afterChange],
    }),
    changeMyPassword: build.mutation<void, ChangeOwnPasswordBody>({
      query: (body) => ({ url: `${root}/password`, method: 'PUT', body }),
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
