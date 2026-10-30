import { requestApiBlob } from '@admin/shared/api-client';

import { customAccessLoss } from '../../cache/custom-sewing/custom-access-loss';
import { customApiError } from '../../errors/custom-sewing/custom-api-error';
import { mapCustomFile, mapCustomFiles } from '../../mappers/custom-files/custom-file.mapper';
import { mapCustomDetail } from '../../mappers/custom-sewing/custom-detail.mapper';
import { customBaseApi } from '../custom-sewing/custom-base-api';

import type { CustomDetail, CustomFileSelection, CustomPrivateFile } from '@admin/clients/model';
import type { operations } from '@admin/shared/contracts';

type FileScope = { id: string; versionId?: string; quoteId?: string };
type SetFilesBody =
  operations['setCrmCustomSewingFiles']['requestBody']['content']['application/json'];
type UploadBody =
  operations['uploadCrmPrivateFile']['requestBody']['content']['multipart/form-data'];

export const customFilesApi = customBaseApi.injectEndpoints({
  endpoints: (build) => ({
    getCustomFiles: build.query<CustomPrivateFile[], FileScope>({
      query: ({ id, versionId, quoteId }) => ({
        url: `/api/crm/custom-sewing/${encodeURIComponent(id)}/files`,
        params: {
          versionId,
          quoteId,
        } satisfies operations['getCrmCustomSewingFiles']['parameters']['query'],
      }),
      transformResponse: (value: unknown, _meta, args) => mapCustomFiles(value, args.id),
      transformErrorResponse: customApiError,
      onQueryStarted: customAccessLoss,
      keepUnusedDataFor: 0,
      providesTags: (_r, _e, { id }) => [{ type: 'CustomSewing', id }],
    }),
    uploadCustomFile: build.mutation<
      CustomPrivateFile,
      { id: string; requestId: string; file: File }
    >({
      query: ({ id, requestId, file }) => {
        const body = new FormData();
        const append = (name: keyof UploadBody, value: string | Blob) => body.append(name, value);
        append('draftId', id);
        append('requestId', requestId);
        append('file', file);
        return { url: '/api/crm/files', method: 'POST', body, headers: { 'Content-Type': null } };
      },
      transformResponse: (value: unknown, _meta, args) => {
        const file = mapCustomFile(value);
        if (file.draftId !== args.id || file.isFinalized)
          throw new Error('Некоректний результат завантаження.');
        return file;
      },
      transformErrorResponse: customApiError,
      onQueryStarted: customAccessLoss,
    }),
    setCustomFiles: build.mutation<
      CustomDetail,
      { id: string; revision: number; requestId: string; files: readonly CustomFileSelection[] }
    >({
      query: ({ id, revision, requestId, files }) => ({
        url: `/api/crm/custom-sewing/${encodeURIComponent(id)}/files`,
        method: 'PUT',
        body: {
          requestId,
          expectedRevision: revision,
          files: files.map(({ fileId, showInQuote, production }) => ({
            fileId,
            showInQuote,
            production,
          })),
        } satisfies SetFilesBody,
      }),
      transformResponse: mapCustomDetail,
      transformErrorResponse: customApiError,
      onQueryStarted: customAccessLoss,
      invalidatesTags: (result) => (result ? [{ type: 'CustomSewing', id: result.id }] : []),
    }),
  }),
});

export const { useGetCustomFilesQuery, useUploadCustomFileMutation, useSetCustomFilesMutation } =
  customFilesApi;

export async function getCustomFileContent({
  fileId,
  versionId,
  quoteId,
}: {
  fileId: string;
  versionId?: string;
  quoteId?: string;
}): Promise<Blob> {
  const blob = await requestApiBlob({
    url: `/api/crm/files/${encodeURIComponent(fileId)}/content`,
    params: {
      versionId,
      quoteId,
    } satisfies operations['getCrmPrivateFileContent']['parameters']['query'],
    headers: { 'Cache-Control': 'no-store' },
  });
  if (
    !(blob instanceof Blob) ||
    !['application/pdf', 'image/jpeg', 'image/png'].includes(blob.type) ||
    blob.size < 1 ||
    blob.size > 20971520
  )
    throw new Error('Некоректний вміст приватного файлу.');
  return blob;
}
