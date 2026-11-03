import { mediaBaseApi } from './media-base-api';
import { mediaFolderErrors, toMediaApiError } from '../errors/media-api-error';
import { mapMediaFolder, mapMediaFolders } from '../mappers/media-folder.mapper';

import type { MediaFolder, MediaFolderDraft } from '@admin/media/model';
import type { components } from '@admin/shared/contracts';

type MediaFolderInput = components['schemas']['MediaFolderInput'];

const toInput = (draft: MediaFolderDraft): MediaFolderInput => ({
  name: draft.name.trim(),
  parentId: draft.parentId,
});

const folderList = [{ type: 'MediaFolder' as const, id: 'LIST' }];

export const mediaFoldersApi = mediaBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getMediaFolders: build.query<MediaFolder[], void>({
      query: () => '/api/media/folders',
      transformResponse: mapMediaFolders,
      transformErrorResponse: (response) => toMediaApiError(response, mediaFolderErrors),
      providesTags: folderList,
    }),
    createMediaFolder: build.mutation<MediaFolder, MediaFolderDraft>({
      query: (draft) => ({ url: '/api/media/folders', method: 'POST', body: toInput(draft) }),
      transformResponse: mapMediaFolder,
      transformErrorResponse: (response) => toMediaApiError(response, mediaFolderErrors),
      invalidatesTags: (_result, error) => (error ? [] : folderList),
    }),
    updateMediaFolder: build.mutation<MediaFolder, { id: number; draft: MediaFolderDraft }>({
      query: ({ id, draft }) => ({
        url: `/api/media/folders/${id}`,
        method: 'PUT',
        body: toInput(draft),
      }),
      transformResponse: mapMediaFolder,
      transformErrorResponse: (response) => toMediaApiError(response, mediaFolderErrors),
      invalidatesTags: (_result, error) => (error ? [] : folderList),
    }),
    deleteMediaFolder: build.mutation<void, number>({
      query: (id) => ({ url: `/api/media/folders/${id}`, method: 'DELETE' }),
      transformErrorResponse: (response) => toMediaApiError(response, mediaFolderErrors),
      invalidatesTags: (_result, error) => (error ? [] : folderList),
    }),
  }),
});

export const {
  useCreateMediaFolderMutation,
  useDeleteMediaFolderMutation,
  useGetMediaFoldersQuery,
  useUpdateMediaFolderMutation,
} = mediaFoldersApi;
