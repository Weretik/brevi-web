import { ProductionItemShipments, ProductionItemStages } from '@admin/production/ui';
import { Box, Stack, Typography } from '@mui/material';

import { ProductionItemWorkSection } from '../work/production-item-work-section';

import type { ProductionItem, ProductionOrder, ProductionStage } from '@admin/production/model';
import type { ReactNode } from 'react';

interface Props {
  order: ProductionOrder;
  item: ProductionItem;
  busy: boolean;
  onToggleStage: (stage: ProductionStage) => void;
  onShip: () => void;
  onCancelShipment: (shipmentId: number) => void;
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

/** The «Робота» tab: stages, shipments and, for those who see the rate, sewn and cut work. */
export function ProductionItemWorkTab({
  order,
  item,
  busy,
  onToggleStage,
  onShip,
  onCancelShipment,
  onMessage,
}: Props) {
  const { permissions } = order;
  return (
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
  );
}
