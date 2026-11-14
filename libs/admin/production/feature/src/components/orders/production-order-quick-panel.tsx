import { productionOrderOverview, productionStageLabels, todayIso } from '@admin/production/model';
import {
  ProductionConfirmDialog,
  ProductionItemsTable,
  ProductionOrderDueAlert,
  ProductionOrderFacts,
  ProductionOrderStatusPill,
} from '@admin/production/ui';
import { ReferenceEditorDrawer, ReferenceListAlerts } from '@admin/references/ui';
import { Alert, Box, LinearProgress } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useProductionOrder } from '../../hooks/order-editor/use-production-order';
import { useProductionItemTracking } from '../../hooks/tracking/use-production-item-tracking';

import type { PendingStage } from '../../hooks/order-items/use-production-item-panel';
import type { ProductionItem, ProductionOrder, ProductionStage } from '@admin/production/model';

interface Props {
  orderId: number;
  onClose: () => void;
}

/**
 * A row of «Виробничі завдання» opens the order here without leaving the list: facts, the strip when an
 * item is late or due soon, and the items with «→ next stage» (confirmed). An item row and «Відкрити
 * повністю» open the order card.
 */
export function ProductionOrderQuickPanel({ orderId, onClose }: Props) {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingStage | null>(null);
  const data = useProductionOrder(orderId, false);
  const order = data.order;
  const tracking = useProductionItemTracking(order, setMessage);
  const full = (itemId?: number) =>
    navigate(`/production/orders/${orderId}${itemId === undefined ? '' : `?item=${itemId}`}`);

  return (
    <ReferenceEditorDrawer
      titleId="production-order-quick-title"
      title={order ? `Завдання № ${order.number}` : 'Завдання'}
      description={order?.clientName ?? 'Відкриваємо завдання…'}
      formId="production-order-quick"
      paperWidth={820}
      readOnly
      saving={false}
      editLabel="Відкрити повністю"
      editRight={null}
      onClose={onClose}
      onEdit={() => full()}
      onSubmit={onClose}
    >
      {data.error ? (
        <Alert severity="error">{data.error}</Alert>
      ) : !order ? (
        <LinearProgress aria-label="Відкриваємо завдання" />
      ) : (
        <QuickContent
          order={order}
          message={message}
          busy={tracking.busy}
          onCloseMessage={() => setMessage(null)}
          onOpenItem={(itemId) => full(itemId)}
          onOpenQuote={(quoteId) => navigate(`/crm/quotes/${quoteId}`)}
          onNextStage={(item, stage) => setPending({ item, stage })}
        />
      )}
      <ProductionConfirmDialog
        open={pending !== null}
        title="Відмітити етап?"
        text={
          pending
            ? `Позиція ${pending.item.position} «${pending.item.modelName}»: етап «${productionStageLabels[pending.stage]}».`
            : ''
        }
        confirmLabel="Відмітити"
        busy={tracking.busy}
        onClose={() => setPending(null)}
        onConfirm={() => {
          const stage = pending;
          setPending(null);
          if (stage) void tracking.toggle(stage.item, stage.stage);
        }}
      />
    </ReferenceEditorDrawer>
  );
}

function QuickContent({
  order,
  message,
  busy,
  onCloseMessage,
  onOpenItem,
  onOpenQuote,
  onNextStage,
}: {
  order: ProductionOrder;
  message: string | null;
  busy: boolean;
  onCloseMessage: () => void;
  onOpenItem: (itemId: number) => void;
  onOpenQuote: (quoteId: number) => void;
  onNextStage: (item: ProductionItem, stage: ProductionStage) => void;
}) {
  const overview = productionOrderOverview(order, todayIso());
  const quoteId = order.quoteId;
  return (
    <>
      <ReferenceListAlerts
        error={null}
        loading={false}
        onRetry={() => undefined}
        actionMessage={message}
        onCloseActionMessage={onCloseMessage}
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
        onOpenQuote={quoteId === null ? undefined : () => onOpenQuote(quoteId)}
      />
      <ProductionItemsTable
        items={order.items}
        overview={overview}
        selectedId={null}
        busy={busy}
        onOpen={(item) => onOpenItem(item.id)}
        onNextStage={order.permissions.canTrack ? onNextStage : undefined}
      />
    </>
  );
}
