import { apiCall, apiClient, formDataBody } from '@admin/shared/api-client';

import { mediaBaseApi } from './media-base-api';
import { mediaFileErrors, toMediaApiError } from '../errors/media-api-error';
import { mapMediaFile, mapMediaFileDetail, mapMediaFilePage } from '../mappers/media-file.mapper';

import type {
  MediaFile,
  MediaFileDetail,
  MediaFileDraft,
  MediaFilePage,
  MediaFileQuery,
} from '@admin/media/model';
import type { components } from '@admin/shared/contracts';

type MediaFileInput = components['schemas']['MediaFileInput'];
type MoveMediaFilesInput = components['schemas']['MoveMediaFilesInput'];

export interface UploadMediaFileRequest {
  file: File;
  folderId: number | null;
}

/** The folder filter goes only with a folder, and an empty search is not sent. */
export function mediaFileQueryParams(query: MediaFileQuery) {
  const search = query.search.trim();
  return {
    ...(query.folderId !== null
      ? { folderId: query.folderId, includeSubfolders: query.includeSubfolders }
      : {}),
    ...(search ? { search } : {}),
    page: query.page,
    pageSize: query.pageSize,
  };
}

const toInput = (draft: MediaFileDraft): MediaFileInput => ({
  fileName: draft.fileName.trim(),
  alt: draft.alt.trim() || null,
  folderId: draft.folderId,
});

/** Any photo change also changes folder counts. */
const afterChange = [
  { type: 'MediaFile' as const, id: 'LIST' },
  { type: 'MediaFolder' as const, id: 'LIST' },
];

export const mediaFilesApi = mediaBaseApi.injectEndpoints({
  endpoints: (build) => ({
    searchMediaFiles: build.query<MediaFilePage, MediaFileQuery>({
      queryFn: (query, { signal }) =>
        apiCall(
          apiClient.GET('/api/media/files', {
            params: { query: mediaFileQueryParams(query) },
            signal,
          }),
          mapMediaFilePage,
          (response) => toMediaApiError(response, mediaFileErrors),
        ),
      providesTags: (result) => [
        { type: 'MediaFile', id: 'LIST' },
        ...(result?.items.map(({ id }) => ({ type: 'MediaFile' as const, id })) ?? []),
      ],
    }),
    getMediaFile: build.query<MediaFileDetail, number>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.GET('/api/media/files/{id}', { params: { path: { id: id } }, signal }),
          mapMediaFileDetail,
          (response) => toMediaApiError(response, mediaFileErrors),
        ),
      providesTags: (_result, _error, id) => [{ type: 'MediaFile', id }],
    }),
    uploadMediaFile: build.mutation<MediaFile, UploadMediaFileRequest>({
      queryFn: ({ file, folderId }, { signal }) =>
        apiCall(
          apiClient.POST('/api/media/files', { ...formDataBody({ file, folderId }), signal }),
          mapMediaFile,
          (response) => toMediaApiError(response, mediaFileErrors),
        ),
      invalidatesTags: (_result, error) => (error ? [] : afterChange),
    }),
    updateMediaFile: build.mutation<MediaFile, { id: number; draft: MediaFileDraft }>({
      queryFn: ({ id, draft }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/media/files/{id}', {
            params: { path: { id: id } },
            body: toInput(draft),
            signal,
          }),
          mapMediaFile,
          (response) => toMediaApiError(response, mediaFileErrors),
        ),
      invalidatesTags: (_result, error, { id }) =>
        error ? [] : [...afterChange, { type: 'MediaFile', id }],
    }),
    moveMediaFiles: build.mutation<void, { fileIds: number[]; folderId: number | null }>({
      queryFn: ({ fileIds, folderId }, { signal }) =>
        apiCall(
          apiClient.POST('/api/media/files/move', {
            body: { fileIds, folderId } satisfies MoveMediaFilesInput,
            signal,
          }),
          undefined,
          (response) => toMediaApiError(response, mediaFileErrors),
        ),
      invalidatesTags: (_result, error, { fileIds }) =>
        error ? [] : [...afterChange, ...fileIds.map((id) => ({ type: 'MediaFile' as const, id }))],
    }),
    deleteMediaFile: build.mutation<void, number>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.DELETE('/api/media/files/{id}', { params: { path: { id: id } }, signal }),
          undefined,
          (response) => toMediaApiError(response, mediaFileErrors),
        ),
      invalidatesTags: (_result, error, id) =>
        error ? [] : [...afterChange, { type: 'MediaFile', id }],
    }),
  }),
});

export const {
  useDeleteMediaFileMutation,
  useGetMediaFileQuery,
  useMoveMediaFilesMutation,
  useSearchMediaFilesQuery,
  useUpdateMediaFileMutation,
  useUploadMediaFileMutation,
} = mediaFilesApi;
