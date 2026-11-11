import {
  ProductionFiles,
  ProductionItemShipments,
  ProductionItemStages,
} from '@admin/production/ui';
import { ItemFabricSection } from '@admin/warehouse/feature';
import { Box, Typography } from '@mui/material';

import { ProductionItemWorkSection } from '../work/production-item-work-section';

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
  busy: boolean;
  onToggleStage: (stage: ProductionStage) => void;
  onShip: () => void;
  onCancelShipment: (shipmentId: number) => void;
  onUpload: (kind: ProductionFileKind, file: File) => void;
  onDeleteFile: (file: ProductionOrderFile) => void;
  onMessage: (message: string) => void;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box>
      <Typography variant="overline" color="text.secondary" component="h4">
        {title}
      </Typography>
      {children}
    </Box>
  );
}

/** What the workshop does with one item: stages, shipments, work, fabric and its files. */
export function ProductionItemWork({
  order,
  item,
  busy,
  onToggleStage,
  onShip,
  onCancelShipment,
  onUpload,
  onDeleteFile,
  onMessage,
}: Props) {
  const { permissions } = order;
  const files = order.files.filter((file) => file.itemId === item.id);
  return (
    <>
      <Section title="Етапи">
        <ProductionItemStages
          itemName={item.modelName}
          stages={item.stages}
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
        <Section title="Робота">
          <ProductionItemWorkSection order={order} item={item} onMessage={onMessage} />
        </Section>
      )}
      <Section title="Тканина">
        <ItemFabricSection
          orderId={order.id}
          itemId={item.id}
          scope="orders"
          onMessage={onMessage}
        />
      </Section>
      {(files.length > 0 || permissions.canManageFiles) && (
        <Section title="Файли">
          <ProductionFiles
            label={`Файли: ${item.modelName}`}
            files={files}
            busy={busy}
            onUpload={permissions.canManageFiles ? onUpload : undefined}
            onDelete={permissions.canManageFiles ? onDeleteFile : undefined}
          />
        </Section>
      )}
    </>
  );
}
