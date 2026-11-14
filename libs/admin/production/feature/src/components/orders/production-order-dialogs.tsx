import { productionStageLabels } from '@admin/production/model';
import { ProductionCancelDialog, ProductionConfirmDialog } from '@admin/production/ui';

import type { useProductionOrderFiles } from '../../hooks/files/use-production-order-files';
import type { useProductionOrderActions } from '../../hooks/order-editor/use-production-order-actions';
import type { useProductionItemPanel } from '../../hooks/order-items/use-production-item-panel';
import type { useProductionItemTracking } from '../../hooks/tracking/use-production-item-tracking';
import type { useProductionOrderStatus } from '../../hooks/tracking/use-production-order-status';
import type { ProductionOrder } from '@admin/production/model';

/** The confirmations of the order page: next stage, cancelling the order, deleting a file or the order. */
export function ProductionOrderDialogs({
  order,
  panel,
  tracking,
  status,
  files,
  actions,
}: {
  order: ProductionOrder;
  panel: ReturnType<typeof useProductionItemPanel>;
  tracking: ReturnType<typeof useProductionItemTracking>;
  status: ReturnType<typeof useProductionOrderStatus>;
  files: ReturnType<typeof useProductionOrderFiles>;
  actions: ReturnType<typeof useProductionOrderActions>;
}) {
  return (
    <>
      <ProductionConfirmDialog
        open={panel.pending !== null}
        title="Відмітити етап?"
        text={
          panel.pending
            ? `Позиція ${panel.pending.item.position} «${panel.pending.item.modelName}»: етап «${productionStageLabels[panel.pending.stage]}».`
            : ''
        }
        confirmLabel="Відмітити"
        busy={tracking.busy}
        onClose={panel.cancelStage}
        onConfirm={() => {
          const pending = panel.pending;
          panel.cancelStage();
          if (pending) void tracking.toggle(pending.item, pending.stage);
        }}
      />
      <ProductionCancelDialog
        open={status.cancelling}
        number={order.number}
        reason={status.reason}
        error={status.reasonError}
        busy={status.busy}
        onChange={status.changeReason}
        onClose={status.closeCancel}
        onConfirm={() => void status.confirmCancel()}
      />
      <ProductionConfirmDialog
        open={files.deleting !== null}
        title="Видалити файл?"
        text={`Файл «${files.deleting?.name ?? ''}» зникне із завдання.`}
        confirmLabel="Видалити"
        danger
        busy={files.removing}
        onClose={files.cancelDelete}
        onConfirm={() => void files.confirmDelete()}
      />
      <ProductionConfirmDialog
        open={actions.confirmingDelete}
        title="Видалити завдання?"
        text={`Завдання № ${order.number} зникне зі списку. КП залишиться.`}
        confirmLabel="Видалити"
        danger
        busy={actions.deleting}
        onClose={actions.cancelDelete}
        onConfirm={() => void actions.confirmDelete()}
      />
    </>
  );
}
