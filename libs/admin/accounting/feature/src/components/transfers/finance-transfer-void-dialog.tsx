import { formatLedgerDate, formatMinor } from '@admin/accounting/model';
import { FinanceDeleteDialog } from '@admin/accounting/ui';

import type { useFinanceTransferVoid } from '../../hooks/transfers/use-finance-transfer-void';

/** «Анулювати переказ?»: the transfer stays in the journal and history but stops changing balances. */
export function FinanceTransferVoidDialog({
  voiding,
}: {
  voiding: ReturnType<typeof useFinanceTransferVoid>;
}) {
  const pending = voiding.pending;
  return (
    <FinanceDeleteDialog
      open={Boolean(pending)}
      title="Анулювати переказ?"
      text={
        pending
          ? `${formatLedgerDate(pending.date)}, ${pending.fromAccountName} → ${pending.toAccountName}, ${formatMinor(pending.amountMinor, pending.currency)}. Переказ залишиться в журналі й історії, але більше не змінюватиме залишки. Повернути його не можна.`
          : ''
      }
      confirmLabel="Анулювати"
      deleting={voiding.deleting}
      onClose={voiding.cancel}
      onConfirm={() => void voiding.confirm()}
    />
  );
}
