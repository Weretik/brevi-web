import { formatDay } from '@admin/production/model';
import { ProductionFiles, ProductionItemDetails } from '@admin/production/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { ItemFabricSection } from '@admin/warehouse/feature';
import { Tab, Tabs, Typography } from '@mui/material';

import { ProductionItemNav } from './production-item-nav';
import { ProductionItemWorkTab } from './production-item-work-tab';

import type { ProductionItemTab } from '../../hooks/order-items/use-production-item-panel';
import type {
  ProductionFileKind,
  ProductionItem,
  ProductionOrder,
  ProductionOrderFile,
  ProductionStage,
} from '@admin/production/model';

interface Props {
  order: ProductionOrder;
  item: ProductionItem;
  tab: ProductionItemTab;
  busy: boolean;
  onTab: (tab: ProductionItemTab) => void;
  /** Opens the previous or next item without closing the panel. */
  onMove: (item: ProductionItem) => void;
  onClose: () => void;
  onEdit?: () => void;
  onToggleStage: (stage: ProductionStage) => void;
  onShip: () => void;
  onCancelShipment: (shipmentId: number) => void;
  onUpload: (kind: ProductionFileKind, file: File) => void;
  onDeleteFile: (file: ProductionOrderFile) => void;
  onMessage: (message: string) => void;
}

/**
 * The side panel of one item: «Робота» (stages, shipments and, for those who see the rate, work), «Деталі»,
 * «Тканина» and «Файли». The arrows move to the neighbouring item; «Редагувати позицію» opens the item form.
 */
export function ProductionItemPanel({
  order,
  item,
  tab,
  busy,
  onTab,
  onMove,
  onClose,
  onEdit,
  onToggleStage,
  onShip,
  onCancelShipment,
  onUpload,
  onDeleteFile,
  onMessage,
}: Props) {
  const { permissions } = order;
  const files = order.files.filter((file) => file.itemId === item.id);
  const fabric = [item.fabricCode, [item.mainColor, ...item.additionalColors].join(' + ')]
    .filter(Boolean)
    .join(' · ');

  return (
    <ReferenceEditorDrawer
      titleId="production-item-panel-title"
      title={`${item.position}. ${item.modelName}`}
      description={`${item.quantity} шт. · готово до ${formatDay(item.dueDate)}${fabric ? ` · ${fabric}` : ''}`}
      formId="production-item-panel"
      paperWidth={720}
      readOnly
      saving={false}
      editLabel={onEdit ? 'Редагувати позицію' : null}
      readActions={<ProductionItemNav order={order} item={item} onMove={onMove} />}
      onClose={onClose}
      onEdit={() => onEdit?.()}
      onSubmit={onClose}
    >
      <Tabs
        value={tab}
        onChange={(_event, value: ProductionItemTab) => onTab(value)}
        variant="scrollable"
        allowScrollButtonsMobile
        sx={{ mt: -2, mb: 2, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab value="work" label="Робота" />
        <Tab value="details" label="Деталі" />
        <Tab value="fabric" label="Тканина" />
        <Tab value="files" label={files.length ? `Файли ${files.length}` : 'Файли'} />
      </Tabs>
      {tab === 'work' && (
        <ProductionItemWorkTab
          order={order}
          item={item}
          busy={busy}
          onToggleStage={onToggleStage}
          onShip={onShip}
          onCancelShipment={onCancelShipment}
          onMessage={onMessage}
        />
      )}
      {tab === 'details' && <ProductionItemDetails item={item} permissions={permissions} />}
      {tab === 'fabric' && (
        <ItemFabricSection
          orderId={order.id}
          itemId={item.id}
          scope="orders"
          onMessage={onMessage}
        />
      )}
      {tab === 'files' &&
        (files.length > 0 || permissions.canManageFiles ? (
          <ProductionFiles
            label={`Файли: ${item.modelName}`}
            files={files}
            busy={busy}
            onUpload={permissions.canManageFiles ? onUpload : undefined}
            onDelete={permissions.canManageFiles ? onDeleteFile : undefined}
          />
        ) : (
          <Typography color="text.secondary">Файлів немає.</Typography>
        ))}
    </ReferenceEditorDrawer>
  );
}
