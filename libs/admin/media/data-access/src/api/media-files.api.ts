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

export function serializeMediaFileQuery(query: MediaFileQuery): string {
  const params = new URLSearchParams();
  if (query.folderId !== null) {
    params.set('folderId', String(query.folderId));
    params.set('includeSubfolders', String(query.includeSubfolders));
  }
  const search = query.search.trim();
  if (search) params.set('search', search);
  params.set('page', String(query.page));
  params.set('pageSize', String(query.pageSize));
  return params.toString();
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
      query: (query) => `/api/media/files?${serializeMediaFileQuery(query)}`,
      transformResponse: mapMediaFilePage,
      transformErrorResponse: (response) => toMediaApiError(response, mediaFileErrors),
      providesTags: (result) => [
        { type: 'MediaFile', id: 'LIST' },
        ...(result?.items.map(({ id }) => ({ type: 'MediaFile' as const, id })) ?? []),
      ],
    }),
    getMediaFile: build.query<MediaFileDetail, number>({
      query: (id) => `/api/media/files/${id}`,
      transformResponse: mapMediaFileDetail,
      transformErrorResponse: (response) => toMediaApiError(response, mediaFileErrors),
      providesTags: (_result, _error, id) => [{ type: 'MediaFile', id }],
    }),
    uploadMediaFile: build.mutation<MediaFile, UploadMediaFileRequest>({
      query: ({ file, folderId }) => {
        const body = new FormData();
        body.set('file', file);
        if (folderId !== null) body.set('folderId', String(folderId));
        return { url: '/api/media/files', method: 'POST', body };
      },
      transformResponse: mapMediaFile,
      transformErrorResponse: (response) => toMediaApiError(response, mediaFileErrors),
      invalidatesTags: (_result, error) => (error ? [] : afterChange),
    }),
    updateMediaFile: build.mutation<MediaFile, { id: number; draft: MediaFileDraft }>({
      query: ({ id, draft }) => ({
        url: `/api/media/files/${id}`,
        method: 'PUT',
        body: toInput(draft),
      }),
      transformResponse: mapMediaFile,
      transformErrorResponse: (response) => toMediaApiError(response, mediaFileErrors),
      invalidatesTags: (_result, error, { id }) =>
        error ? [] : [...afterChange, { type: 'MediaFile', id }],
    }),
    moveMediaFiles: build.mutation<void, { fileIds: number[]; folderId: number | null }>({
      query: ({ fileIds, folderId }) => ({
        url: '/api/media/files/move',
        method: 'POST',
        body: { fileIds, folderId } satisfies MoveMediaFilesInput,
      }),
      transformErrorResponse: (response) => toMediaApiError(response, mediaFileErrors),
      invalidatesTags: (_result, error, { fileIds }) =>
        error ? [] : [...afterChange, ...fileIds.map((id) => ({ type: 'MediaFile' as const, id }))],
    }),
    deleteMediaFile: build.mutation<void, number>({
      query: (id) => ({ url: `/api/media/files/${id}`, method: 'DELETE' }),
      transformErrorResponse: (response) => toMediaApiError(response, mediaFileErrors),
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
