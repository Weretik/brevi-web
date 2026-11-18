import { FinanceDeleteDialog } from '@admin/accounting/ui';

import type { useFinanceCounterpartyActions } from '../../hooks/counterparties/use-finance-counterparty-actions';

/** Confirmations of the counterparties page: archive a counterparty, make a one-off name permanent. */
export function FinanceCounterpartyDialogs({
  actions,
}: {
  actions: ReturnType<typeof useFinanceCounterpartyActions>;
}) {
  return (
    <>
      <FinanceDeleteDialog
        open={Boolean(actions.archive.pending)}
        title="Архівувати контрагента?"
        text={`«${actions.archive.pending?.name ?? ''}» зникне з вибору в операціях. Наявні операції залишаться з ним.`}
        confirmLabel="Архівувати"
        deleting={actions.archive.busy}
        onClose={actions.archive.cancel}
        onConfirm={actions.archive.confirm}
      />
      <FinanceDeleteDialog
        open={Boolean(actions.promote.pending)}
        title="Зробити постійним?"
        text={`Буде створено підтвердженого фінансового контрагента «${actions.promote.pending?.oneoffName ?? ''}», і ця операція перейде до нього. Інші операції з такою назвою не зміняться.`}
        confirmLabel="Зробити постійним"
        confirmColor="primary"
        deleting={actions.promote.busy}
        onClose={actions.promote.cancel}
        onConfirm={actions.promote.confirm}
      />
    </>
  );
}
