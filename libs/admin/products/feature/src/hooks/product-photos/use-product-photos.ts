import {
  useGetProductAccessQuery,
  useGetProductPhotosQuery,
  useSetProductPhotosMutation,
  useUploadProductMediaMutation,
} from '@admin/products/data-access';
import { movePhoto } from '@admin/products/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { ProductPhoto } from '@admin/products/model';

/**
 * The card tab «Фото» (CAT-018). Every change saves at once: Admin (the Director also holds Admin)
 * adds from the library or uploads, removes, moves and picks the main photo; others only view.
 */
export function useProductPhotos(productId: number) {
  const access = useGetProductAccessQuery();
  const photos = useGetProductPhotosQuery(productId);
  const [save, saveState] = useSetProductPhotosMutation();
  const [upload] = useUploadProductMediaMutation();
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const list = photos.data ?? [];
  const canEdit = access.currentData?.canManagePhotos === true && !access.isError;
  const busy = saveState.isLoading || uploading;

  async function store(next: readonly ProductPhoto[], mainMediaFileId: number | null) {
    setMessage(null);
    try {
      await save({
        id: productId,
        body: { mediaFileIds: next.map((photo) => photo.mediaFileId), mainMediaFileId },
      }).unwrap();
    } catch (error) {
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти фото.'));
    }
  }

  const ids = (extra: readonly number[]) => [
    ...list.map((photo) => photo.mediaFileId),
    ...extra.filter((id) => !list.some((photo) => photo.mediaFileId === id)),
  ];

  async function addIds(extra: readonly number[]) {
    if (extra.length === 0) return;
    setMessage(null);
    try {
      await save({
        id: productId,
        body: { mediaFileIds: ids(extra), mainMediaFileId: null },
      }).unwrap();
    } catch (error) {
      setMessage(adminApiErrorMessage(error, 'Не вдалося додати фото.'));
    }
  }

  async function uploadFiles(files: readonly File[]) {
    if (files.length === 0 || busy) return;
    setUploading(true);
    setMessage(null);
    const added: number[] = [];
    try {
      for (const file of files) added.push(await upload(file).unwrap());
    } catch (error) {
      setMessage(adminApiErrorMessage(error, 'Не вдалося завантажити фото.'));
    } finally {
      setUploading(false);
    }
    await addIds(added);
  }

  return {
    photos: list,
    loading: photos.isLoading,
    error: photos.error ? adminApiErrorMessage(photos.error, 'Не вдалося завантажити фото.') : null,
    reload: () => void photos.refetch(),
    canEdit,
    busy,
    message,
    clearMessage: () => setMessage(null),
    addFromLibrary: (mediaFileIds: readonly number[]) => void addIds(mediaFileIds),
    upload: (files: readonly File[]) => void uploadFiles(files),
    remove: (mediaFileId: number) =>
      void store(
        list.filter((photo) => photo.mediaFileId !== mediaFileId),
        null,
      ),
    makeMain: (mediaFileId: number) => void store(list, mediaFileId),
    move: (index: number, step: -1 | 1) => void store(movePhoto(list, index, step), null),
  };
}
