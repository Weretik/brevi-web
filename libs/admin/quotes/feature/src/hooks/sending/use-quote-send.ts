import { useGetQuoteSendDraftQuery, useSendQuoteMutation } from '@admin/quotes/data-access';
import { quoteSendErrors } from '@admin/quotes/model';
import { useEffect, useMemo, useState } from 'react';

import type { Quote, QuoteSendForm } from '@admin/quotes/model';

const messageOf = (error: unknown, fallback: string) =>
  (error as { message?: string } | undefined)?.message ?? fallback;

/** «Надіслати КП» panel: the chosen letter, the editable recipient, subject and text, and sending. */
export function useQuoteSend(quote: Quote, onSent: (quote: Quote) => void) {
  const draft = useGetQuoteSendDraftQuery(quote.id, { refetchOnMountOrArgChange: true });
  const [send, sending] = useSendQuoteMutation();
  const [letterIndex, setLetterIndex] = useState(0);
  const [form, setForm] = useState<QuoteSendForm>({ to: '', subject: '', body: '' });
  const [showErrors, setShowErrors] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const letters = draft.data?.letters;

  useEffect(() => {
    const letter = letters?.[letterIndex];
    if (letter) setForm((current) => ({ ...current, subject: letter.subject, body: letter.body }));
  }, [letters, letterIndex]);

  const savedTo = draft.data?.to;
  useEffect(() => {
    if (savedTo) setForm((current) => (current.to ? current : { ...current, to: savedTo }));
  }, [savedTo]);

  const errors = useMemo(() => quoteSendErrors(form), [form]);

  return {
    draft: draft.data ?? null,
    loading: draft.isLoading,
    loadError: draft.isError ? messageOf(draft.error, 'Не вдалося підготувати лист.') : null,
    letterIndex,
    chooseLetter: setLetterIndex,
    form,
    change: (patch: Partial<QuoteSendForm>) => setForm((current) => ({ ...current, ...patch })),
    errors: showErrors ? errors : {},
    error,
    sending: sending.isLoading,
    send: async () => {
      setShowErrors(true);
      setError(null);
      if (Object.keys(errors).length > 0) return;
      try {
        onSent(await send({ id: quote.id, version: quote.version, form }).unwrap());
      } catch (cause) {
        setError(messageOf(cause, 'Не вдалося надіслати КП.'));
      }
    },
  };
}
