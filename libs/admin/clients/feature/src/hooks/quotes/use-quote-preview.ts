import { usePreviewQuotePricesMutation } from '@admin/clients/data-access';
import { quotePriceErrors, sameQuoteSelection } from '@admin/clients/model';
import { useRef, useState } from 'react';

import { quoteError } from '../../errors/quotes/quote-error';
import { useStableRequest } from '../requests/use-stable-request';

import type { QuoteDraft, QuoteVariantDraft } from '@admin/clients/model';
import type { Dispatch, SetStateAction } from 'react';

export function useQuotePreview(
  quoteId: string | undefined,
  setDraft: Dispatch<SetStateAction<QuoteDraft>>,
  onError: (message: string) => void,
) {
  const [trigger] = usePreviewQuotePricesMutation();
  const request = useStableRequest();
  const busy = useRef(false);
  const [pending, setPending] = useState(false);
  const calculate = async (variant: QuoteVariantDraft) => {
    if (busy.current) return;
    const errors = quotePriceErrors(variant.selection);
    if (Object.keys(errors).length) {
      onError(Object.values(errors).join(' '));
      return;
    }
    busy.current = true;
    setPending(true);
    onError('');
    const intent = { quoteId, selection: variant.selection };
    try {
      const basis = await trigger({ ...intent, requestId: request.id(intent) }).unwrap();
      if (!sameQuoteSelection(basis.selection, variant.selection)) {
        request.reset();
        onError('Розрахунок не відповідає вибору. Повторіть розрахунок.');
        return;
      }
      setDraft((draft) => ({
        ...draft,
        items: draft.items.map((item) => ({
          ...item,
          variants: item.variants.map((current) =>
            current.key === variant.key && sameQuoteSelection(current.selection, variant.selection)
              ? { ...current, basis: { origin: 'preview', value: basis } }
              : current,
          ),
        })),
      }));
      request.reset();
    } catch (error) {
      onError(quoteError(error));
    } finally {
      busy.current = false;
      setPending(false);
    }
  };
  return { calculate, pending };
}
