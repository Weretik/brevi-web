import {
  useCreateQuoteMutation,
  useGetQuoteQuery,
  useSaveQuoteMutation,
} from '@admin/quotes/data-access';
import { emptyQuoteDraft, quoteDraftErrors, quoteToDraft } from '@admin/quotes/model';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useQuoteDraft } from './use-quote-draft';

import type { Quote, QuoteStartPrefill } from '@admin/quotes/model';

const messageOf = (error: unknown, fallback: string) =>
  (error as { message?: string } | undefined)?.message ?? fallback;

/**
 * The КП «під запит» editor: loads a КП (or starts a new one, filled from «Нове КП»), keeps the draft, saves it whole.
 * A 409 means someone saved a newer version; the page offers «Оновити».
 */
export function useQuoteEditor(id: number | null, prefill: QuoteStartPrefill | null = null) {
  const navigate = useNavigate();
  const loaded = useGetQuoteQuery(id ?? 0, { skip: id === null });
  const [createQuote, creating] = useCreateQuoteMutation();
  const [saveQuote, saving] = useSaveQuoteMutation();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [saveError, setSaveError] = useState<{ message: string; stale: boolean } | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const draft = useQuoteDraft({ ...emptyQuoteDraft(), ...(id === null ? prefill : null) });
  const { reset } = draft;

  useEffect(() => {
    if (!loaded.data) return;
    setQuote(loaded.data);
    reset(quoteToDraft(loaded.data));
  }, [loaded.data, reset]);

  const errors = useMemo(() => quoteDraftErrors(draft.draft), [draft.draft]);
  const hasErrors = Object.keys(errors).length > 0;

  /** Saves the draft; returns the saved КП, or null when it has problems or the server refused it. */
  const save = async (): Promise<Quote | null> => {
    setShowErrors(true);
    setSaveError(null);
    if (hasErrors) return null;
    try {
      const saved =
        quote === null
          ? await createQuote(draft.draft).unwrap()
          : await saveQuote({ id: quote.id, draft: draft.draft }).unwrap();
      setQuote(saved);
      reset(quoteToDraft(saved));
      setShowErrors(false);
      setSavedAt(Date.now());
      if (id === null) navigate(`/crm/quotes/${saved.id}`, { replace: true });
      return saved;
    } catch (error) {
      const status = (error as { status?: number }).status;
      setSaveError({
        message: messageOf(error, 'Не вдалося зберегти КП.'),
        stale: status === 409 && quote !== null,
      });
      return null;
    }
  };

  return {
    quote,
    applyServerQuote: (next: Quote) => {
      setQuote(next);
      reset(quoteToDraft(next));
    },
    loading: id !== null && loaded.isLoading,
    loadError:
      id !== null && loaded.isError ? messageOf(loaded.error, 'Не вдалося відкрити КП.') : null,
    reload: async () => {
      setSaveError(null);
      const fresh = await loaded.refetch();
      if (fresh.data) {
        setQuote(fresh.data);
        reset(quoteToDraft(fresh.data));
      }
    },
    ...draft,
    errors: showErrors ? errors : {},
    save,
    saving: creating.isLoading || saving.isLoading,
    saveError,
    savedAt,
  };
}
