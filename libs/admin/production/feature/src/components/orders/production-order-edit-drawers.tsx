import { ProductionOrderHeaderDrawer } from './production-order-header-drawer';
import { ProductionItemDrawer } from '../order-items/production-item-drawer';
import { ProductionShipmentDrawer } from '../tracking/production-shipment-drawer';

import type { useProductionOrderEditor } from '../../hooks/order-editor/use-production-order-editor';
import type { useProductionItemTracking } from '../../hooks/tracking/use-production-item-tracking';
import type { ProductionOrder } from '@admin/production/model';

/** The side panel that changes the order: its header, one item, or a shipment of an item. */
export function ProductionOrderEditDrawers({
  order,
  editor,
  tracking,
}: {
  order: ProductionOrder;
  editor: ReturnType<typeof useProductionOrderEditor>;
  tracking: ReturnType<typeof useProductionItemTracking>;
}) {
  const editing = editor.editing;
  return (
    <>
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
          withRate={order.permissions.seesSewingRate}
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
    </>
  );
}
