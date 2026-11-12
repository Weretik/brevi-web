import { productionOrderOverview, productionStageLabels, todayIso } from '@admin/production/model';
import {
  ProductionCancelDialog,
  ProductionConfirmDialog,
  ProductionItemsTable,
  ProductionOrderDueAlert,
  ProductionOrderFacts,
  ProductionOrderPrint,
  ProductionOrderStatusPill,
} from '@admin/production/ui';
import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { Alert, Box, CircularProgress, Stack } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ProductionItemDrawer } from '../../components/orders/production-item-drawer';
import { ProductionItemPanel } from '../../components/orders/production-item-panel';
import { ProductionOrderActions } from '../../components/orders/production-order-actions';
import { ProductionOrderHeaderDrawer } from '../../components/orders/production-order-header-drawer';
import { ProductionOrderHistoryDrawer } from '../../components/orders/production-order-history-drawer';
import { ProductionOrderWork } from '../../components/tracking/production-order-work';
import { ProductionShipmentDrawer } from '../../components/tracking/production-shipment-drawer';
import { useProductionOrderFiles } from '../../hooks/files/use-production-order-files';
import { useProductionItemPanel } from '../../hooks/orders/use-production-item-panel';
import { useProductionOrder } from '../../hooks/orders/use-production-order';
import { useProductionOrderActions } from '../../hooks/orders/use-production-order-actions';
import { useProductionOrderEditor } from '../../hooks/orders/use-production-order-editor';
import { useProductionTelegram } from '../../hooks/telegram/use-production-telegram';
import { useProductionItemTracking } from '../../hooks/tracking/use-production-item-tracking';
import { useProductionOrderStatus } from '../../hooks/tracking/use-production-order-status';

const parseId = (value: string | undefined) =>
  value && /^\d+$/.test(value) ? Number(value) : null;

/**
 * «Виробниче завдання № …» (concept B): the header with «Друк», «⋯» and «Редагувати», one strip of facts, a
 * strip only when an item is late or due soon, the table of items (stage bar, «→ next stage» with a
 * confirmation), then the order files and the unsent message to the workshop group. A row opens the item
 * side panel (`?item=`, `?tab=`); «Історія змін» opens in a side panel too.
 */
export function ProductionOrderPage() {
  const id = parseId(useParams<{ id: string }>().id);
  const navigate = useNavigate();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const data = useProductionOrder(id, historyOpen);
  const order = data.order;
  const editor = useProductionOrderEditor(order, () => setMessage('Зміни збережено.'));
  const actions = useProductionOrderActions(order, {
    onCopied: (copy) => {
      setHistoryOpen(false);
      setMessage(`Створено копію № ${copy.number}.`);
      navigate(`/production/orders/${copy.id}`);
    },
    onDeleted: () => navigate('/production/orders', { replace: true }),
    onError: setMessage,
  });
  const tracking = useProductionItemTracking(order, setMessage);
  const status = useProductionOrderStatus(order, setMessage);
  const files = useProductionOrderFiles(order, setMessage);
  const telegram = useProductionTelegram(order, setMessage);
  const panel = useProductionItemPanel(order);

  if (id === null) return <Alert severity="error">Такого завдання немає.</Alert>;
  if (data.error)
    return (
      <ReferenceListAlerts
        error={data.error}
        loading={false}
        onRetry={() => void data.reload()}
        actionMessage={null}
        onCloseActionMessage={() => undefined}
      />
    );
  if (!order)
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
        <CircularProgress aria-label="Відкриваємо завдання" />
      </Box>
    );

  const { permissions } = order;
  const editing = editor.editing;
  const overview = productionOrderOverview(order, todayIso());
  const quoteId = order.quoteId;
  const openItem = panel.item;

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Виробничі завдання"
        title={`Завдання № ${order.number}`}
        subtitle={order.clientName}
        actions={
          <ProductionOrderActions
            permissions={permissions}
            copying={actions.copying}
            statusBusy={status.busy}
            onBack={() => navigate('/production/orders')}
            onHistory={() => setHistoryOpen(true)}
            onCopy={() => void actions.copy()}
            onClose={() => void status.close()}
            onCancel={status.requestCancel}
            onReopen={() => void status.reopen()}
            onDelete={actions.requestDelete}
            onEdit={editor.editHeader}
          />
        }
      />
      <ReferenceListAlerts
        error={null}
        loading={false}
        onRetry={() => undefined}
        actionMessage={message}
        onCloseActionMessage={() => setMessage(null)}
      />
      {order.status !== 'New' && (
        <Box sx={{ mb: 2 }}>
          <ProductionOrderStatusPill status={order.status} />
        </Box>
      )}
      <ProductionOrderDueAlert overview={overview} />
      <ProductionOrderFacts
        order={order}
        overview={overview}
        onOpenQuote={quoteId === null ? undefined : () => navigate(`/crm/quotes/${quoteId}`)}
      />
      <Stack sx={{ gap: 2 }}>
        <ProductionItemsTable
          items={order.items}
          overview={overview}
          selectedId={panel.item?.id ?? null}
          busy={tracking.busy}
          onOpen={(item) => panel.open(item)}
          onNextStage={permissions.canTrack ? panel.askStage : undefined}
        />
        <ProductionOrderWork
          order={order}
          filesBusy={files.busy}
          telegramBusy={telegram.busy}
          onUpload={(kind, file) => void files.add(null, kind, file)}
          onDeleteFile={files.requestDelete}
          onSendTelegram={() => void telegram.send()}
          onOpenSettings={permissions.canTrack ? () => navigate('/production/settings') : undefined}
        />
      </Stack>
      {openItem && !editing && !tracking.shipping && (
        <ProductionItemPanel
          order={order}
          item={openItem}
          tab={panel.tab}
          busy={tracking.busy || files.busy}
          onTab={panel.setTab}
          onMove={(item) => panel.open(item)}
          onClose={panel.close}
          onEdit={permissions.canEdit ? () => editor.editItem(openItem) : undefined}
          onToggleStage={(stage) => void tracking.toggle(openItem, stage)}
          onShip={() => tracking.openShipping(openItem)}
          onCancelShipment={(shipmentId) => void tracking.cancel(shipmentId)}
          onUpload={(kind, file) => void files.add(openItem.id, kind, file)}
          onDeleteFile={files.requestDelete}
          onMessage={setMessage}
        />
      )}
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
      {historyOpen && (
        <ProductionOrderHistoryDrawer
          number={order.number}
          changes={data.history}
          loading={data.historyLoading}
          error={data.historyError}
          onClose={() => setHistoryOpen(false)}
        />
      )}
      {editing?.kind === 'header' && (
        <ProductionOrderHeaderDrawer
          number={order.number}
          values={editing.values}
          errors={editor.headerErrors}
          message={editor.message}
          saving={editor.saving}
          onChange={editor.changeHeader}
          onClose={editor.close}
          onSubmit={() => void editor.save()}
        />
      )}
      {editing?.kind === 'item' && (
        <ProductionItemDrawer
          item={editing.item}
          values={editing.values}
          errors={editor.itemErrors}
          withRate={permissions.seesSewingRate}
          message={editor.message}
          saving={editor.saving}
          onChange={editor.changeItem}
          onClose={editor.close}
          onSubmit={() => void editor.save()}
        />
      )}
      {tracking.shipping && (
        <ProductionShipmentDrawer
          item={tracking.shipping.item}
          values={tracking.shipping.values}
          errors={tracking.errors}
          message={tracking.message}
          saving={tracking.saving}
          onChange={tracking.changeShipping}
          onClose={tracking.closeShipping}
          onSubmit={() => void tracking.ship()}
        />
      )}
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
      <ProductionOrderPrint order={order} />
    </Box>
  );
}

export default ProductionOrderPage;
