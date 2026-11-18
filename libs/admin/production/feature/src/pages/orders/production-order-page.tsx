import { ProductionOrderPrint } from '@admin/production/ui';
import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { Alert, Box, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ProductionOrderContent } from './production-order-content';
import { ProductionOrderActions } from '../../components/orders/page/production-order-actions';
import { ProductionOrderDialogs } from '../../components/orders/page/production-order-dialogs';
import { ProductionOrderEditDrawers } from '../../components/orders/page/production-order-edit-drawers';
import { ProductionOrderHistoryDrawer } from '../../components/orders/page/production-order-history-drawer';
import { useProductionOrderFiles } from '../../hooks/files/use-production-order-files';
import { useProductionOrder } from '../../hooks/order-editor/use-production-order';
import { useProductionOrderActions } from '../../hooks/order-editor/use-production-order-actions';
import { useProductionOrderEditor } from '../../hooks/order-editor/use-production-order-editor';
import { useProductionItemPanel } from '../../hooks/order-items/use-production-item-panel';
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
      <ProductionOrderContent
        order={order}
        editing={Boolean(editor.editing)}
        panel={panel}
        tracking={tracking}
        files={files}
        telegram={telegram}
        onEditItem={editor.editItem}
        onMessage={setMessage}
      />
      <ProductionOrderDialogs
        order={order}
        panel={panel}
        tracking={tracking}
        status={status}
        files={files}
        actions={actions}
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
      <ProductionOrderEditDrawers order={order} editor={editor} tracking={tracking} />
      <ProductionOrderPrint order={order} />
    </Box>
  );
}

export default ProductionOrderPage;
