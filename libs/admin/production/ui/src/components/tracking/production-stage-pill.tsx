import { productionStageLabels } from '@admin/production/model';
import { Box } from '@mui/material';

import type { ProductionStage } from '@admin/production/model';

/** Colour of a stage; the furthest stage colours the item row and the order in the list. */
export const productionStageTone: Record<ProductionStage, { bg: string; fg: string }> = {
  New: { bg: 'action.hover', fg: 'text.secondary' },
  FabricOrdered: { bg: 'info.light', fg: 'info.main' },
  FabricAvailable: { bg: 'info.light', fg: 'info.main' },
  Cutting: { bg: 'warning.light', fg: 'warning.dark' },
  Application: { bg: 'warning.light', fg: 'warning.dark' },
  Sewing: { bg: 'warning.light', fg: 'warning.dark' },
  Ready: { bg: 'secondary.light', fg: 'secondary.dark' },
  Shipped: { bg: 'success.light', fg: 'success.dark' },
  Complete: { bg: 'success.light', fg: 'success.dark' },
};

export function ProductionStagePill({ stage }: { stage: ProductionStage }) {
  const tone = productionStageTone[stage];
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        height: 24,
        px: 1,
        borderRadius: 999,
        typography: 'caption',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        bgcolor: tone.bg,
        color: tone.fg,
      }}
    >
      <Box
        component="span"
        aria-hidden
        sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor' }}
      />
      {productionStageLabels[stage]}
    </Box>
  );
}
