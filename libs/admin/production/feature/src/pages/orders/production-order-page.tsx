import { productionOrderStatusLabels } from '@admin/production/model';
import {
  ProductionCancelDialog,
  ProductionConfirmDialog,
  ProductionItemCard,
  ProductionOrderHistory,
  ProductionOrderPrint,
  ProductionOrderStatusPill,
} from '@admin/production/ui';
import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { Alert, Box, CircularProgress, LinearProgress, Stack, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ProductionItemDrawer } from '../../components/orders/production-item-drawer';
import { ProductionOrderActions } from '../../components/orders/production-order-actions';
import { ProductionOrderHeaderDrawer } from '../../components/orders/production-order-header-drawer';
import { ProductionOrderSummary } from '../../components/orders/production-order-summary';
import { ProductionItemWork } from '../../components/tracking/production-item-work';
import { ProductionOrderWork } from '../../components/tracking/production-order-work';
import { ProductionShipmentDrawer } from '../../components/tracking/production-shipment-drawer';
import { useProductionOrderFiles } from '../../hooks/files/use-production-order-files';
import { useProductionOrder } from '../../hooks/orders/use-production-order';
import { useProductionOrderActions } from '../../hooks/orders/use-production-order-actions';
import { useProductionOrderEditor } from '../../hooks/orders/use-production-order-editor';
import { useProductionTelegram } from '../../hooks/telegram/use-production-telegram';
import { useProductionItemTracking } from '../../hooks/tracking/use-production-item-tracking';
import { useProductionOrderStatus } from '../../hooks/tracking/use-production-order-status';

type OrderTab = 'description' | 'history';

const parseId = (value: string | undefined) =>
  value && /^\d+$/.test(value) ? Number(value) : null;

/**
 * «Виробниче завдання № …»: «Опис» with every item, its stages, shipments and files, the message to
 * the workshop group, and «Історія змін».
 */
export function ProductionOrderPage() {
  const id = parseId(useParams<{ id: string }>().id);
  const navigate = useNavigate();
  const [tab, setTab] = useState<OrderTab>('description');
  const [message, setMessage] = useState<string | null>(null);
  const data = useProductionOrder(id, tab === 'history');
  const order = data.order;
  const editor = useProductionOrderEditor(order, () => setMessage('Зміни збережено.'));
  const actions = useProductionOrderActions(order, {
    onCopied: (copy) => {
      setTab('description');
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

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Виробничі завдання"
        title={`Завдання № ${order.number}`}
        subtitle={`${order.clientName} · ${productionOrderStatusLabels[order.status]}`}
        actions={
          <ProductionOrderActions
            permissions={permissions}
            copying={actions.copying}
            statusBusy={status.busy}
            onBack={() => navigate('/production/orders')}
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
      <Stack direction="row" sx={{ alignItems: 'center', gap: 2, mb: 2 }}>
        <ProductionOrderStatusPill status={order.status} />
        <Tabs value={tab} onChange={(_event, next: OrderTab) => setTab(next)}>
          <Tab value="description" label="Опис" />
          <Tab value="history" label="Історія змін" />
        </Tabs>
      </Stack>
      {tab === 'description' ? (
        <Stack sx={{ gap: 2 }}>
          <ProductionOrderSummary order={order} />
          <ProductionOrderWork
            order={order}
            filesBusy={files.busy}
            telegramBusy={telegram.busy}
            onUpload={(kind, file) => void files.add(null, kind, file)}
            onDeleteFile={files.requestDelete}
            onSendTelegram={() => void telegram.send()}
            onOpenSettings={
              permissions.canTrack ? () => navigate('/production/settings') : undefined
            }
          />
          {order.items.map((item) => (
            <ProductionItemCard
              key={item.id}
              item={item}
              permissions={permissions}
              onEdit={permissions.canEdit ? () => editor.editItem(item) : undefined}
            >
              <ProductionItemWork
                order={order}
                item={item}
                busy={tracking.busy || files.busy}
                onToggleStage={(stage) => void tracking.toggle(item, stage)}
                onShip={() => tracking.openShipping(item)}
                onCancelShipment={(shipmentId) => void tracking.cancel(shipmentId)}
                onUpload={(kind, file) => void files.add(item.id, kind, file)}
                onDeleteFile={files.requestDelete}
              />
            </ProductionItemCard>
          ))}
        </Stack>
      ) : data.historyError ? (
        <Alert severity="error">{data.historyError}</Alert>
      ) : data.historyLoading && data.history.length === 0 ? (
        <LinearProgress />
      ) : (
        <ProductionOrderHistory changes={data.history} />
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
