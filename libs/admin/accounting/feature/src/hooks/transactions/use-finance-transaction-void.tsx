import { useVoidFinanceTransactionMutation } from '@admin/accounting/data-access';
import { formatLedgerDate, formatSignedMinor } from '@admin/accounting/model';
import { FinanceDeleteDialog } from '@admin/accounting/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import { canEditTransaction } from './use-finance-transaction-editor';

import type { FinanceTransaction } from '@admin/accounting/model';

/**
 * «Анулювати операцію» with its confirmation: `request` asks, the dialog voids. The outcome goes to
 * `onMessage`; a bank or already voided operation is refused with a message.
 */
export function useFinanceTransactionVoid(onMessage: (message: string) => void) {
  const [pending, setPending] = useState<FinanceTransaction | null>(null);
  const [voidTransaction, state] = useVoidFinanceTransactionMutation();

  function request(transaction: FinanceTransaction) {
    if (!canEditTransaction(transaction)) {
      onMessage('Цю операцію вже анульовано або вона з банківської виписки.');
      return;
    }
    setPending(transaction);
  }

  async function confirm() {
    if (!pending) return;
    try {
      await voidTransaction({ id: pending.id, version: pending.version }).unwrap();
      onMessage('Операцію анульовано.');
    } catch (failure) {
      onMessage(
        `Не вдалося анулювати операцію. ${adminApiErrorMessage(failure, 'Спробуйте ще раз.')}`,
      );
    }
    setPending(null);
  }

  const dialog = (
    <FinanceDeleteDialog
      open={Boolean(pending)}
      title="Анулювати операцію?"
      text={
        pending
          ? `${formatLedgerDate(pending.date)}, ${formatSignedMinor(pending.type, pending.amountMinor, pending.currency)}. Операція залишиться в журналі й історії, але більше не впливатиме на залишки й підсумки. Повернути її не можна.`
          : ''
      }
      confirmLabel="Анулювати"
      deleting={state.isLoading}
      onClose={() => setPending(null)}
      onConfirm={() => void confirm()}
    />
  );

  return { request, dialog };
}
