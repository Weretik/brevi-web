import {
  useLazyListProductMediaQuery,
  useUploadProductMediaMutation,
} from '@admin/products/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { Alert, Button, Stack } from '@mui/material';
import { useState } from 'react';

import { validateMediaFile } from '../../model/media-library/media-file-validation';

import type { ProductMedia } from '@admin/products/model';

interface Props {
  onReady: (media: ProductMedia) => void;
}

export function ProductPhotoUpload({ onReady }: Props) {
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [listProductMedia, listState] = useLazyListProductMediaQuery();
  const [uploadProductMedia, uploadState] = useUploadProductMediaMutation();
  const uploading = listState.isFetching || uploadState.isLoading;
  const [error, setError] = useState<string | null>(null);

  async function checkReady(mediaFileId: number) {
    const media = await listProductMedia().unwrap();
    const uploaded = media.find((item) => item.id === mediaFileId);
    if (!uploaded || uploaded.status !== 'Ready') {
      setPendingId(mediaFileId);
      setError('Фото ще не готове. Повторіть перевірку пізніше.');
      return;
    }
    setPendingId(null);
    setError(null);
    onReady(uploaded);
  }

  async function upload(file: File) {
    const validationError = validateMediaFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    try {
      const mediaFileId = await uploadProductMedia(file).unwrap();
      await checkReady(mediaFileId);
    } catch (cause) {
      setError(adminApiErrorMessage(cause, 'Не вдалося завантажити фото.'));
    }
  }

  async function uploadPending(mediaFileId: number) {
    try {
      await checkReady(mediaFileId);
    } catch (cause) {
      setError(adminApiErrorMessage(cause, 'Не вдалося перевірити готовність фото.'));
    }
  }

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 1, alignItems: 'flex-start' }}>
      <Button component="label" variant="outlined" disabled={uploading}>
        Завантажити фото
        <input
          hidden
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void upload(file);
            event.target.value = '';
          }}
        />
      </Button>
      {pendingId !== null && (
        <Button disabled={uploading} onClick={() => void uploadPending(pendingId)}>
          Перевірити готовність
        </Button>
      )}
      {error && <Alert severity="warning">{error}</Alert>}
    </Stack>
  );
}
