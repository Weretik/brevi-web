import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

interface Versioned {
  id: string;
  version: number;
}

interface Texts {
  /** Shown after the server accepted the deletion. */
  done: string;
  /** Shown before the server reason when it refused. */
  failed: string;
}

/**
 * «Видалити …?» for a row the server deletes only at its known version: ask first, then delete and report the result
 * through `onMessage`.
 */
export function useVersionedDeletion<Row extends Versioned>(
  remove: (target: Versioned) => { unwrap: () => Promise<unknown> },
  texts: Texts,
  onMessage: (message: string) => void,
) {
  const [pending, setPending] = useState<Row | null>(null);

  const confirm = async () => {
    if (!pending) return;
    try {
      await remove({ id: pending.id, version: pending.version }).unwrap();
      onMessage(texts.done);
    } catch (failure) {
      onMessage(`${texts.failed} ${adminApiErrorMessage(failure, 'Спробуйте ще раз.')}`);
    }
    setPending(null);
  };

  return { pending, request: setPending, confirm, cancel: () => setPending(null) };
}
