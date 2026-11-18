import { productionOrderOverview, todayIso } from '@admin/production/model';
import {
  ProductionItemsTable,
  ProductionOrderDueAlert,
  ProductionOrderFacts,
  ProductionOrderStatusPill,
} from '@admin/production/ui';
import { Box, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { ProductionItemPanel } from '../../components/order-items/production-item-panel';
import { ProductionOrderWork } from '../../components/tracking/production-order-work';

import type { useProductionOrderFiles } from '../../hooks/files/use-production-order-files';
import type { useProductionItemPanel } from '../../hooks/order-items/use-production-item-panel';
import type { useProductionTelegram } from '../../hooks/telegram/use-production-telegram';
import type { useProductionItemTracking } from '../../hooks/tracking/use-production-item-tracking';
import type { ProductionItem, ProductionOrder } from '@admin/production/model';

interface Props {
  order: ProductionOrder;
  /** The header or an item form is open, so the item panel stays hidden. */
  editing: boolean;
  panel: ReturnType<typeof useProductionItemPanel>;
  tracking: ReturnType<typeof useProductionItemTracking>;
  files: ReturnType<typeof useProductionOrderFiles>;
  telegram: ReturnType<typeof useProductionTelegram>;
  onEditItem: (item: ProductionItem) => void;
  onMessage: (message: string) => void;
}

/** The body of an order: status, due strip, facts, items, files and the message, and the item side panel. */
export function ProductionOrderContent({
  order,
  editing,
  panel,
  tracking,
  files,
  telegram,
  onEditItem,
  onMessage,
}: Props) {
  const navigate = useNavigate();
  const { permissions } = order;
  const overview = productionOrderOverview(order, todayIso());
  const quoteId = order.quoteId;
  const openItem = panel.item;
  return (
    <>
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
          onEdit={permissions.canEdit ? () => onEditItem(openItem) : undefined}
          onToggleStage={(stage) => void tracking.toggle(openItem, stage)}
          onShip={() => tracking.openShipping(openItem)}
          onCancelShipment={(shipmentId) => void tracking.cancel(shipmentId)}
          onUpload={(kind, file) => void files.add(openItem.id, kind, file)}
          onDeleteFile={files.requestDelete}
          onMessage={onMessage}
        />
      )}
    </>
  );
}
