import {
  bankStatementRollbackText,
  financeOperationForms,
  formatFinanceCount,
} from '@admin/accounting/model';
import { FinanceDeleteDialog } from '@admin/accounting/ui';

import type { useBankStatement } from '../../hooks/statements/use-bank-statement';

/** Confirmations of «Провести виписку» and «Відкотити виписку». */
export function BankStatementDialogs({
  view,
  confirming,
  onClose,
}: {
  view: ReturnType<typeof useBankStatement>;
  confirming: 'book' | 'rollback' | null;
  onClose: () => void;
}) {
  const details = view.details;
  const totals = details?.totals;
  return (
    <>
      <FinanceDeleteDialog
        open={confirming === 'book'}
        title="Провести виписку?"
        text={
          totals
            ? `Буде додано ${formatFinanceCount(totals.operations, financeOperationForms)} і ${totals.transfers} переказів. Нових контрагентів буде створено непідтвердженими. Помилкове проведення можна скасувати кнопкою «Відкотити виписку».`
            : ''
        }
        deleting={view.booking}
        confirmLabel="Провести"
        confirmColor="primary"
        onClose={onClose}
        onConfirm={() => {
          onClose();
          void view.book();
        }}
      />
      <FinanceDeleteDialog
        open={confirming === 'rollback'}
        title="Відкотити виписку?"
        text={details?.rollback ? bankStatementRollbackText(details.rollback) : ''}
        deleting={view.rollingBack}
        confirmLabel="Відкотити"
        onClose={onClose}
        onConfirm={() => {
          onClose();
          view.rollback();
        }}
      />
    </>
  );
}
