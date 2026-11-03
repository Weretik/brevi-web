import { useMoveMediaFilesMutation } from '@admin/media/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

/** «Перемістити» for selected photos: the side panel asks only for the target folder. */
export function useMediaMove(onDone: (message: string) => void) {
  const [moveMediaFiles, moveState] = useMoveMediaFilesMutation();
  const [fileIds, setFileIds] = useState<readonly number[] | null>(null);
  const [folderId, setFolderId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(): Promise<boolean> {
    if (!fileIds) return false;
    setError(null);
    try {
      await moveMediaFiles({ fileIds: [...fileIds], folderId }).unwrap();
      onDone(`Переміщено фото: ${fileIds.length}.`);
      setFileIds(null);
      return true;
    } catch (cause) {
      setError(adminApiErrorMessage(cause, 'Не вдалося перемістити фото.'));
      return false;
    }
  }

  return {
    fileIds,
    folderId,
    error,
    saving: moveState.isLoading,
    open: (ids: readonly number[], initialFolderId: number | null) => {
      setError(null);
      setFolderId(initialFolderId);
      setFileIds(ids);
    },
    close: () => setFileIds(null),
    setFolderId,
    submit,
  };
}
