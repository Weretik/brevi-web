import { useCreateQuoteMutation, useSaveQuoteVersionMutation } from '@admin/clients/data-access';
import { quoteDraftErrors } from '@admin/clients/model';
import { isAdminApiError } from '@admin/shared/api-client';
import { useRef, useState } from 'react';

import { quoteError } from '../../errors/quotes/quote-error';
import { useStableRequest } from '../requests/use-stable-request';

import type { QuoteDetail, QuoteDraft } from '@admin/clients/model';

export function useQuoteWrite(
  onAccepted: (value: QuoteDetail) => void,
  onCreated: (id: string) => void,
) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);
  const [uncertain, setUncertain] = useState(false);
  const busy = useRef(false);
  const captured = useRef<{
    detail: QuoteDetail | null;
    draft: QuoteDraft;
    requestId: string;
  } | null>(null);
  const [create] = useCreateQuoteMutation();
  const [saveVersion] = useSaveQuoteVersionMutation();
  const request = useStableRequest();

  const save = async (detail: QuoteDetail | null, draft: QuoteDraft) => {
    if (
      busy.current ||
      (detail && (!detail.canEdit || detail.state !== 'draft' || detail.archived))
    )
      return;
    const validation = captured.current ? {} : quoteDraftErrors(draft, Date.now());
    setErrors(validation);
    if (Object.keys(validation).length) return;
    busy.current = true;
    setPending(true);
    setError('');
    setSaved(false);
    const intent = { quoteId: detail?.publicId, revision: detail?.revision, draft };
    const write = captured.current ?? { detail, draft, requestId: request.id(intent) };
    captured.current = write;
    try {
      const value = write.detail
        ? await saveVersion({
            quoteId: write.detail.publicId,
            revision: write.detail.revision,
            draft: write.draft,
            requestId: write.requestId,
          }).unwrap()
        : await create({ draft: write.draft, requestId: write.requestId }).unwrap();
      onAccepted(value);
      request.reset();
      captured.current = null;
      setUncertain(false);
      setSaved(true);
      setErrors({});
      if (!write.detail) onCreated(value.publicId);
    } catch (failure) {
      const unknown =
        !isAdminApiError(failure) ||
        failure.status === 0 ||
        failure.status === 408 ||
        failure.status >= 500;
      setUncertain(unknown);
      if (!unknown) captured.current = null;
      setError(quoteError(failure));
    } finally {
      busy.current = false;
      setPending(false);
    }
  };
  const isLocked = () => busy.current || captured.current !== null;
  const reset = () => {
    if (isLocked()) return;
    request.reset();
    setErrors({});
    setError('');
    setSaved(false);
  };
  return { save, isLocked, reset, pending, uncertain, errors, error, setError, saved };
}
