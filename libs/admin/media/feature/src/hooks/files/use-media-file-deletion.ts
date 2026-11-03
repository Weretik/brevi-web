import { useDeleteMediaFileMutation } from '@admin/media/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

/**
 * Deletes the chosen photos one by one. A used photo is refused by the server with the place that
 * uses it; such photos stay and their messages are shown.
 */
export function useMediaFileDeletion(onDone: (message: string) => void) {
  const [deleteMediaFile] = useDeleteMediaFileMutation();
  const [target, setTarget] = useState<readonly number[] | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm(): Promise<readonly number[]> {
    if (!target) return [];
    setDeleting(true);
    setError(null);
    const deleted: number[] = [];
    const messages: string[] = [];
    for (const id of target) {
      try {
        await deleteMediaFile(id).unwrap();
        deleted.push(id);
      } catch (cause) {
        messages.push(adminApiErrorMessage(cause, 'Не вдалося видалити фото.'));
      }
    }
    setDeleting(false);
    if (messages.length > 0) {
      setTarget(target.filter((id) => !deleted.includes(id)));
      setError(
        deleted.length > 0
          ? `Видалено ${deleted.length}. ${[...new Set(messages)].join(' ')}`
          : [...new Set(messages)].join(' '),
      );
    } else {
      setTarget(null);
      onDone(deleted.length === 1 ? 'Фото видалено.' : `Видалено фото: ${deleted.length}.`);
    }
    return deleted;
  }

  return {
    target,
    deleting,
    error,
    request: (ids: readonly number[]) => {
      setError(null);
      setTarget(ids);
    },
    close: () => setTarget(null),
    confirm,
  };
}
