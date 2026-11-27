import {
  itemApplicationKindLabels,
  itemColorsText,
  orderModelsText,
  uniqueValues,
} from '@admin/production/model';
import { Box, Typography } from '@mui/material';

import { StageCell } from './production-order-cells';

import type { ProductionOrderSummary } from '@admin/production/model';

const dash = (
  <Typography component="span" variant="body2" color="text.secondary">
    —
  </Typography>
);

/**
 * The main cell of a row: the models in bold, under them the client in small plain text, then the stage. The model
 * of the chosen filter stands first; the shipped pieces are in the tooltip.
 */
export function OrderCell({
  row,
  firstModelCode,
}: {
  row: ProductionOrderSummary;
  firstModelCode: string | null;
}) {
  const models = orderModelsText(row.items, firstModelCode);
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, minWidth: 0, py: 0.5 }}
      title={`Відвантажено ${row.shippedQuantity} з ${row.totalQuantity} шт.`}
    >
      <Box component="span" sx={{ fontWeight: 600, lineHeight: 1.3 }} className="order-ellipsis">
        {models || row.clientName}
      </Box>
      {models && (
        <Typography
          component="span"
          variant="caption"
          color="text.secondary"
          className="order-ellipsis"
        >
          {row.clientName}
        </Typography>
      )}
      <StageCell row={row} />
    </Box>
  );
}

/** «Вишивка», «Друк» of the items, each once. */
export function ApplicationsCell({ row }: { row: ProductionOrderSummary }) {
  const kinds = uniqueValues(row.items.flatMap((item) => item.applications));
  if (kinds.length === 0) return dash;
  return (
    <Typography variant="body2">
      {kinds
        .map((kind) => itemApplicationKindLabels[kind as keyof typeof itemApplicationKindLabels])
        .join(' · ')}
    </Typography>
  );
}

/** The fabric of the order and, under it, the main and additional colours of each item. */
export function FabricColorCell({ row }: { row: ProductionOrderSummary }) {
  const fabrics = uniqueValues(row.items.map((item) => item.fabricName)).join(', ');
  const colors = uniqueValues(row.items.map(itemColorsText)).join(' · ');
  if (!fabrics && !colors) return dash;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0, lineHeight: 1.35 }}>
      {fabrics && (
        <Box component="span" className="order-ellipsis" title={fabrics}>
          {fabrics}
        </Box>
      )}
      {colors && (
        <Typography
          component="span"
          variant="caption"
          color="text.secondary"
          className="order-ellipsis"
          title={colors}
        >
          {colors}
        </Typography>
      )}
    </Box>
  );
}
