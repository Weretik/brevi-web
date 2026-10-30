import {
  useArchiveQuoteMutation,
  useCopyQuoteMutation,
  useRepriceQuoteMutation,
  useTransferQuoteMutation,
} from '@admin/clients/data-access';
import { isAdminApiError } from '@admin/shared/api-client';
import { useRef, useState } from 'react';

import { quoteError } from '../../../errors/quotes/quote-error';
import { useStableRequest } from '../../requests/use-stable-request';

import type { QuoteDetail, QuoteLifecycleIntent } from '@admin/clients/model';

export function useQuoteLifecycleWrite(onLock: (pending: boolean, uncertain: boolean) => void) {
  const [copy] = useCopyQuoteMutation();
  const [transfer] = useTransferQuoteMutation();
  const [archive] = useArchiveQuoteMutation();
  const [reprice] = useRepriceQuoteMutation();
  const [pending, setPending] = useState(false);
  const [uncertain, setUncertain] = useState(false);
  const [error, setError] = useState('');
  const busy = useRef(false);
  const captured = useRef<{ intent: QuoteLifecycleIntent; requestId: string } | null>(null);
  const request = useStableRequest();
  const run = async (intent: QuoteLifecycleIntent): Promise<QuoteDetail | 'accessLost' | null> => {
    if (busy.current) return null;
    const write = captured.current ?? {
      intent: structuredClone(intent),
      requestId: request.id(intent),
    };
    captured.current = write;
    busy.current = true;
    setPending(true);
    setError('');
    onLock(true, uncertain);
    try {
      const args = { ...write.intent, requestId: write.requestId };
      let detail: QuoteDetail;
      switch (args.action) {
        case 'copy':
          detail = await copy(args).unwrap();
          break;
        case 'transfer':
          detail = await transfer(args).unwrap();
          break;
        case 'archive':
          detail = await archive(args).unwrap();
          break;
        case 'reprice':
          detail = await reprice(args).unwrap();
          break;
      }
      captured.current = null;
      request.reset();
      setUncertain(false);
      return detail;
    } catch (failure) {
      const unknown =
        !isAdminApiError(failure) ||
        failure.status === 0 ||
        failure.status === 408 ||
        failure.status >= 500;
      setUncertain(unknown);
      if (!unknown) captured.current = null;
      setError(quoteError(failure));
      if (isAdminApiError(failure) && (failure.status === 403 || failure.status === 404))
        return 'accessLost';
      return null;
    } finally {
      busy.current = false;
      setPending(false);
      onLock(false, captured.current !== null);
    }
  };
  return { pending, uncertain, error, run, clearError: () => setError('') };
}
