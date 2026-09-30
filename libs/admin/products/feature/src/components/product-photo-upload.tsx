import { listProductMedia, uploadProductMedia } from '@admin/products/data-access';
import { Alert, Button, Stack } from '@mui/material';
import { useState } from 'react';

import { validateMediaFile } from '../model/media-file-validation';

import type { ProductMedia } from '@admin/products/data-access';

interface Props {
  onMediaRefreshed: (media: ProductMedia[]) => void;
  onReady: (media: ProductMedia) => void;
}

export function ProductPhotoUpload({ onMediaRefreshed, onReady }: Props) {
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkReady(mediaFileId: number) {
    const media = await listProductMedia();
    onMediaRefreshed(media);
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
    setUploading(true);
    setError(null);
    try {
      const mediaFileId = await uploadProductMedia(file);
      await checkReady(mediaFileId);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Не вдалося завантажити фото.');
    } finally {
      setUploading(false);
    }
  }

  async function uploadPending(mediaFileId: number) {
    setUploading(true);
    try {
      await checkReady(mediaFileId);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Не вдалося перевірити готовність фото.');
    } finally {
      setUploading(false);
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
