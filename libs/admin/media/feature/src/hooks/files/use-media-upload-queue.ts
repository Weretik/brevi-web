import { useUploadMediaFileMutation } from '@admin/media/data-access';
import { validateMediaUpload } from '@admin/media/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { MediaUploadFailure } from '@admin/media/ui';

export interface MediaUploadResult {
  total: number;
  uploaded: number;
  failures: MediaUploadFailure[];
}

/** Uploads several photos one after another into a folder and reports what did not go through. */
export function useMediaUploadQueue() {
  const [uploadMediaFile] = useUploadMediaFileMutation();
  const [progress, setProgress] = useState({ total: 0, done: 0, active: false });

  async function upload(
    files: readonly File[],
    folderId: number | null,
  ): Promise<MediaUploadResult | null> {
    if (files.length === 0 || progress.active) return null;
    setProgress({ total: files.length, done: 0, active: true });
    const failures: MediaUploadFailure[] = [];
    for (const file of files) {
      const invalid = validateMediaUpload(file);
      if (invalid) failures.push({ fileName: file.name, message: invalid });
      else {
        try {
          await uploadMediaFile({ file, folderId }).unwrap();
        } catch (cause) {
          failures.push({
            fileName: file.name,
            message: adminApiErrorMessage(cause, 'Не вдалося завантажити фото.'),
          });
        }
      }
      setProgress((current) => ({ ...current, done: current.done + 1 }));
    }
    setProgress({ total: 0, done: 0, active: false });
    return { total: files.length, uploaded: files.length - failures.length, failures };
  }

  return { ...progress, upload };
}
