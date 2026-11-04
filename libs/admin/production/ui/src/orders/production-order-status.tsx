import { productionOrderStatusLabels } from '@admin/production/model';
import { Box } from '@mui/material';

import type { ProductionOrderStatus } from '@admin/production/model';

const tone: Record<ProductionOrderStatus, { bg: string; fg: string }> = {
  New: { bg: 'info.light', fg: 'info.main' },
  Closed: { bg: 'action.hover', fg: 'text.secondary' },
  Cancelled: { bg: 'action.hover', fg: 'text.disabled' },
};

/** «Нове», «Закрите», «Скасоване» as a «Цех» pill. */
export function ProductionOrderStatusPill({ status }: { status: ProductionOrderStatus }) {
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
        bgcolor: tone[status].bg,
        color: tone[status].fg,
      }}
    >
      <Box
        component="span"
        aria-hidden
        sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor' }}
      />
      {productionOrderStatusLabels[status]}
    </Box>
  );
}
