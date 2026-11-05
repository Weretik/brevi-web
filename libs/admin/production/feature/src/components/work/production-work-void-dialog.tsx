import { formatDay, productionWorkKindLabels } from '@admin/production/model';
import { ProductionReasonDialog } from '@admin/production/ui';

import type { useStockReason } from '../../hooks/stock/use-stock-reason';
import type { ProductionWork } from '@admin/production/model';

interface Props {
  reversal: ReturnType<typeof useStockReason<ProductionWork>>;
}

/** «Сторно» of a work record: the record stays crossed out and stops counting. */
export function ProductionWorkVoidDialog({ reversal }: Props) {
  const work = reversal.pending;
  return (
    <ProductionReasonDialog
      open={work !== null}
      title="Сторнувати роботу?"
      text={
        work
          ? `${work.employeeName}, ${productionWorkKindLabels[work.kind].toLowerCase()} ${work.quantity} шт. за ${formatDay(work.workDate)}. Запис лишиться в журналі закресленим і не рахуватиметься.`
          : ''
      }
      confirmLabel="Сторнувати"
      reason={reversal.reason}
      error={reversal.error}
      busy={reversal.busy}
      onChange={reversal.change}
      onClose={reversal.cancel}
      onConfirm={() => void reversal.confirm()}
    />
  );
}
