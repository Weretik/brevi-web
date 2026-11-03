import { useUploadMediaFileMutation } from '@admin/media/data-access';
import { validateMediaUpload } from '@admin/media/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { MediaUploadFailure } from '@admin/media/ui';

interface UploadState {
  total: number;
  done: number;
  active: boolean;
  failures: MediaUploadFailure[];
}

const idle: UploadState = { total: 0, done: 0, active: false, failures: [] };

/** Uploads several photos one after another into a folder and keeps the failures. */
export function useMediaUploadQueue() {
  const [uploadMediaFile] = useUploadMediaFileMutation();
  const [state, setState] = useState<UploadState>(idle);

  async function upload(files: readonly File[], folderId: number | null) {
    if (files.length === 0 || state.active) return;
    setState({ total: files.length, done: 0, active: true, failures: [] });
    for (const file of files) {
      const invalid = validateMediaUpload(file);
      let failure: MediaUploadFailure | null = invalid
        ? { fileName: file.name, message: invalid }
        : null;
      if (!failure) {
        try {
          await uploadMediaFile({ file, folderId }).unwrap();
        } catch (cause) {
          failure = {
            fileName: file.name,
            message: adminApiErrorMessage(cause, 'Не вдалося завантажити фото.'),
          };
        }
      }
      setState((current) => ({
        ...current,
        done: current.done + 1,
        failures: failure ? [...current.failures, failure] : current.failures,
      }));
    }
    setState((current) => ({ ...current, active: false }));
  }

  return { ...state, upload, reset: () => setState(idle) };
}
