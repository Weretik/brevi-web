import { formatDay, formatMoney } from '@admin/production/model';
import { ProductionConfirmDialog, ProductionReasonDialog } from '@admin/production/ui';

import type { usePayrollMonthActions } from '../../../hooks/payroll/use-payroll-month-actions';

/** Cancelling a payment or an adjustment with a reason, and confirming closing or reopening the month. */
export function PayrollMonthDialogs({
  label,
  actions,
}: {
  /** The month as «Листопад 2026». */
  label: string;
  actions: ReturnType<typeof usePayrollMonthActions>;
}) {
  const { cancel, confirm, setConfirm } = actions;
  const pending = cancel.pending;
  return (
    <>
      <ProductionReasonDialog
        open={pending !== null}
        title={pending?.kind === 'payment' ? 'Скасувати виплату?' : 'Скасувати запис?'}
        text={
          pending
            ? `${pending.row.employeeName}, ${formatMoney(pending.row.amount)}${
                pending.kind === 'payment' ? ` від ${formatDay(pending.row.paidOn)}` : ''
              }. Запис лишиться в списку закресленим і не рахуватиметься.`
            : ''
        }
        confirmLabel="Скасувати запис"
        reason={cancel.reason}
        error={cancel.error}
        busy={cancel.busy}
        onChange={cancel.change}
        onClose={cancel.cancel}
        onConfirm={() => void cancel.confirm()}
      />
      <ProductionConfirmDialog
        open={confirm !== null}
        title={
          confirm === 'close'
            ? `Закрити ${label.toLowerCase()}?`
            : `Відкрити ${label.toLowerCase()}?`
        }
        text={
          confirm === 'close'
            ? 'Розрахунок збережеться як є. Після закриття роботу, години, виплати й утримання за цей місяць змінити не можна.'
            : 'Місяць знову рахуватиметься з поточних даних, і в ньому можна буде змінювати роботу, години й виплати.'
        }
        confirmLabel={confirm === 'close' ? 'Закрити місяць' : 'Відкрити місяць'}
        busy={actions.changingMonth}
        onClose={() => setConfirm(null)}
        onConfirm={() => void actions.confirmed()}
      />
    </>
  );
}
