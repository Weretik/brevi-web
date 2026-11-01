import { useLazyGetQuoteDeliveryQuery } from '@admin/clients/data-access';
import { isAdminApiError } from '@admin/shared/api-client';
import { useRef, useState } from 'react';

import type { useDocumentAction } from '../use-document-action';
import type { QuoteDeliveryView } from '@admin/clients/model';

/** Read-only conflict recovery; never captures a write or reports an uncertain mutation. */
export function useDeliveryAttemptRefresh(
  quoteId: string,
  action: ReturnType<typeof useDocumentAction>,
  onRefreshed: (row: QuoteDeliveryView) => void,
) {
  const [getDelivery] = useLazyGetQuoteDeliveryQuery();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const generation = useRef(0);
  const busy = useRef(false);
  const reset = () => {
    generation.current++;
    busy.current = false;
    setPending(false);
    setError('');
  };
  const run = (target: QuoteDeliveryView) => {
    if (busy.current || !action.isCurrent() || action.forbidden) return;
    const current = ++generation.current;
    busy.current = true;
    setPending(true);
    setError('');
    void (async () => {
      try {
        const row = await getDelivery({ quoteId, deliveryId: target.id }, false).unwrap();
        if (!action.isCurrent() || current !== generation.current) return;
        if (!row) throw new Error('Спроба недоступна.');
        onRefreshed(row);
        if (!row.canResolveManually)
          setError('Спроба вже оброблена або недоступна для ручної перевірки. Оновіть історію.');
      } catch (failure) {
        if (!action.isCurrent() || current !== generation.current) return;
        if (isAdminApiError(failure) && [401, 403, 404].includes(failure.status))
          await action.execute(async () => {
            throw failure;
          });
        else setError('Не вдалося оновити спробу. Повторіть оновлення.');
      } finally {
        if (action.isCurrent() && current === generation.current) {
          busy.current = false;
          setPending(false);
        }
      }
    })();
  };
  return { pending, error, reset, run };
}
