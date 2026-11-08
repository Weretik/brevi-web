import { useCopyQuoteMutation } from '@admin/quotes/data-access';
import { quoteEditorPath } from '@admin/quotes/model';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Quote } from '@admin/quotes/model';

const messageOf = (error: unknown, fallback: string) =>
  (error as { message?: string } | undefined)?.message ?? fallback;

/** «Копіювати» of a saved КП; the copy opens in its own editor. */
export function useQuoteLifecycle(quote: Quote | null) {
  const navigate = useNavigate();
  const [copyQuote, copying] = useCopyQuoteMutation();
  const [error, setError] = useState<string | null>(null);

  return {
    busy: copying.isLoading,
    error,
    clearError: () => setError(null),
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
