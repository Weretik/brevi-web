import { useUploadProductMediaMutation } from '@admin/products/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import { validateMediaFile } from '../../model/media-library/media-file-validation';

export function useMediaUpload(onSuccess: (message: string) => void) {
  const [uploadProductMedia, uploadState] = useUploadProductMediaMutation();
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setFileName(file.name);
    const validationError = validateMediaFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    try {
      await uploadProductMedia(file).unwrap();
      onSuccess('Фото завантажено.');
    } catch (cause) {
      setError(adminApiErrorMessage(cause, 'Не вдалося завантажити фото.'));
    }
  }

  return { uploading: uploadState.isLoading, fileName, error, upload };
}
