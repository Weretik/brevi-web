import { useVoidFinanceTransferMutation } from '@admin/accounting/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import { canEditTransfer } from './use-finance-transfer-editor';

import type { FinanceTransfer } from '@admin/accounting/model';

/** «Анулювати переказ»: confirm first; a voided or bank transfer is explained instead. */
export function useFinanceTransferVoid(onMessage: (message: string) => void) {
  const [pending, setPending] = useState<FinanceTransfer | null>(null);
  const [voidTransfer, state] = useVoidFinanceTransferMutation();

  const request = (transfer: FinanceTransfer) => {
    if (!canEditTransfer(transfer)) {
      onMessage('Цей переказ уже анульовано або він з банківської виписки.');
      return;
    }
    setPending(transfer);
  };

  const confirm = async () => {
    if (!pending) return;
    try {
      await voidTransfer({ id: pending.id, version: pending.version }).unwrap();
      onMessage('Переказ анульовано.');
    } catch (failure) {
      onMessage(
        `Не вдалося анулювати переказ. ${adminApiErrorMessage(failure, 'Спробуйте ще раз.')}`,
      );
    }
    setPending(null);
  };

  return { pending, request, confirm, cancel: () => setPending(null), deleting: state.isLoading };
}
