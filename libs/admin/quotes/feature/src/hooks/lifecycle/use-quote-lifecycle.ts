import { useCopyQuoteMutation, useSetQuoteArchivedMutation } from '@admin/quotes/data-access';
import { quoteEditorPath } from '@admin/quotes/model';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Quote } from '@admin/quotes/model';

const messageOf = (error: unknown, fallback: string) =>
  (error as { message?: string } | undefined)?.message ?? fallback;

/** «В архів», «Повернути з архіву» and «Копіювати» of a saved КП; a copy opens in its own editor. */
export function useQuoteLifecycle(quote: Quote | null, onChanged: (next: Quote) => void) {
  const navigate = useNavigate();
  const [setArchived, archiving] = useSetQuoteArchivedMutation();
  const [copyQuote, copying] = useCopyQuoteMutation();
  const [error, setError] = useState<string | null>(null);

  return {
    archived: quote?.archivedAt != null,
    busy: archiving.isLoading || copying.isLoading,
    error,
    clearError: () => setError(null),
    setArchived: async (archived: boolean) => {
      if (!quote) return;
      setError(null);
      try {
        onChanged(await setArchived({ id: quote.id, version: quote.version, archived }).unwrap());
      } catch (cause) {
        setError(messageOf(cause, 'Не вдалося змінити архів.'));
      }
    },
    copy: async () => {
      if (!quote) return;
      setError(null);
      try {
        const copy = await copyQuote(quote.id).unwrap();
        navigate(quoteEditorPath(copy.kind, copy.id), {
          state: { notice: `Створено КП ${copy.number} — копію КП ${quote.number}.` },
        });
      } catch (cause) {
        setError(messageOf(cause, 'Не вдалося скопіювати КП.'));
      }
    },
  };
}
