import { useDeleteQuoteMutation } from '@admin/quotes/data-access';
import { useState } from 'react';

const messageOf = (error: unknown, fallback: string) =>
  (error as { message?: string } | undefined)?.message ?? fallback;

/**
 * «Видалити КП» with a confirmation (crm R-34). The server refuses a КП with a production order or a stale version;
 * its message stays in the dialog.
 */
export function useQuoteDelete(onDeleted: () => void) {
  const [target, setTarget] = useState<{ id: number; number: string; version: number } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [deleteQuote, deleting] = useDeleteQuoteMutation();

  return {
    target,
    error,
    deleting: deleting.isLoading,
    ask: (quote: { id: number; number: string; version: number }) => {
      setError(null);
      setTarget(quote);
    },
    cancel: () => setTarget(null),
    confirm: async () => {
      if (!target) return;
      setError(null);
      try {
        await deleteQuote({ id: target.id, version: target.version }).unwrap();
        setTarget(null);
        onDeleted();
      } catch (cause) {
        setError(messageOf(cause, 'Не вдалося видалити КП.'));
      }
    },
  };
}
