import { apiCall, apiClient } from '@admin/shared/api-client';

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
      queryFn: (_arg, { signal }) =>
        apiCall(apiClient.GET('/api/media/folders', { signal }), mapMediaFolders, (response) =>
          toMediaApiError(response, mediaFolderErrors),
        ),
      providesTags: folderList,
    }),
    createMediaFolder: build.mutation<MediaFolder, MediaFolderDraft>({
      queryFn: (draft, { signal }) =>
        apiCall(
          apiClient.POST('/api/media/folders', { body: toInput(draft), signal }),
          mapMediaFolder,
          (response) => toMediaApiError(response, mediaFolderErrors),
        ),
      invalidatesTags: (_result, error) => (error ? [] : folderList),
    }),
    updateMediaFolder: build.mutation<MediaFolder, { id: number; draft: MediaFolderDraft }>({
      queryFn: ({ id, draft }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/media/folders/{id}', {
            params: { path: { id: id } },
            body: toInput(draft),
            signal,
          }),
          mapMediaFolder,
          (response) => toMediaApiError(response, mediaFolderErrors),
        ),
      invalidatesTags: (_result, error) => (error ? [] : folderList),
    }),
    deleteMediaFolder: build.mutation<void, number>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.DELETE('/api/media/folders/{id}', { params: { path: { id: id } }, signal }),
          undefined,
          (response) => toMediaApiError(response, mediaFolderErrors),
        ),
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
