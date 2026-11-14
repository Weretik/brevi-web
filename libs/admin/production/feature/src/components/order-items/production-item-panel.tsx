import { formatDay } from '@admin/production/model';
import {
  ProductionFiles,
  ProductionItemDetails,
  ProductionItemShipments,
  ProductionItemStages,
} from '@admin/production/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { ItemFabricSection } from '@admin/warehouse/feature';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, IconButton, Stack, Tab, Tabs, Tooltip, Typography } from '@mui/material';

import { ProductionItemWorkSection } from '../work/production-item-work-section';

import type { ProductionItemTab } from '../../hooks/order-items/use-production-item-panel';
import type {
  ProductionFileKind,
  ProductionItem,
  ProductionOrder,
  ProductionOrderFile,
  ProductionStage,
} from '@admin/production/model';
import type { ReactNode } from 'react';

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

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box
      sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 2, bgcolor: 'background.paper' }}
    >
      <Typography variant="overline" color="text.secondary" component="h3">
        {title}
      </Typography>
      {children}
    </Box>
  );
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
  const index = order.items.findIndex((x) => x.id === item.id);
  const previous = order.items[index - 1];
  const next = order.items[index + 1];
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
      readActions={
        order.items.length > 1 && (
          <Stack direction="row" sx={{ mr: 'auto', order: -1, alignItems: 'center', gap: 0.5 }}>
            <Tooltip title="Попередня позиція">
              <span>
                <IconButton
                  aria-label="Попередня позиція"
                  disabled={!previous}
                  onClick={() => previous && onMove(previous)}
                >
                  <ChevronLeftIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontFamily: 'var(--admin-font-mono)' }}
            >
              {index + 1} з {order.items.length}
            </Typography>
            <Tooltip title="Наступна позиція">
              <span>
                <IconButton
                  aria-label="Наступна позиція"
                  disabled={!next}
                  onClick={() => next && onMove(next)}
                >
                  <ChevronRightIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        )
      }
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
        <Stack sx={{ gap: 2 }}>
          <Section title="Етапи">
            <ProductionItemStages
              item={item}
              busy={busy}
              onToggle={permissions.canTrack ? onToggleStage : undefined}
            />
          </Section>
          <Section title="Відвантаження">
            <ProductionItemShipments
              item={item}
              busy={busy}
              onShip={permissions.canTrack ? onShip : undefined}
              onCancel={permissions.canTrack ? onCancelShipment : undefined}
            />
          </Section>
          {permissions.seesSewingRate && (
            <Section title="Пошито й покроєно">
              <ProductionItemWorkSection order={order} item={item} onMessage={onMessage} />
            </Section>
          )}
        </Stack>
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
