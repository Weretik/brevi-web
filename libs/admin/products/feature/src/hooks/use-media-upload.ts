import { uploadProductMedia } from '@admin/products/data-access';
import { useState } from 'react';

import { validateMediaFile } from '../model/media-file-validation';

export function useMediaUpload(reload: () => void, onSuccess: (message: string) => void) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setFileName(file.name);
    const validationError = validateMediaFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    setError(null);
    try {
      await uploadProductMedia(file);
      onSuccess('Фото завантажено.');
      reload();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Не вдалося завантажити фото.');
    } finally {
      setUploading(false);
    }
  }

  return { uploading, fileName, error, upload };
}
