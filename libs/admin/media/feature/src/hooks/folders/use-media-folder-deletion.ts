import { useDeleteMediaFolderMutation } from '@admin/media/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { MediaFolderNode } from '@admin/media/model';

/** Deletes an empty folder; the server refuses a folder with photos or subfolders. */
export function useMediaFolderDeletion(
  onDeleted: (node: MediaFolderNode, message: string) => void,
) {
  const [deleteFolder, deleteState] = useDeleteMediaFolderMutation();
  const [target, setTarget] = useState<MediaFolderNode | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    if (!target) return;
    setError(null);
    try {
      await deleteFolder(target.folder.id).unwrap();
      onDeleted(target, `Папку «${target.folder.name}» видалено.`);
      setTarget(null);
    } catch (cause) {
      setError(adminApiErrorMessage(cause, 'Не вдалося видалити папку.'));
    }
  }

  return {
    target,
    error,
    deleting: deleteState.isLoading,
    request: (node: MediaFolderNode) => {
      setError(null);
      setTarget(node);
    },
    close: () => setTarget(null),
    confirm,
  };
}
