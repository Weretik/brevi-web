import { dueState, formatDay, orderStageSpread } from '@admin/production/model';
import { Box, Typography } from '@mui/material';

import { ProductionOrderStatusPill } from '../../../components/orders/production-order-status';
import { ProductionStagePill } from '../../../components/tracking/production-stage-pill';

import type { ProductionOrderSummary } from '@admin/production/model';

/** Nine stage marks: done ones graphite, the order's stage orange, the rest empty. */
function StageSteps({ index, total }: { index: number; total: number }) {
  return (
    <Box component="span" aria-hidden sx={{ display: 'inline-flex', gap: '3px' }}>
      {Array.from({ length: total }, (_, i) => (
        <Box
          key={i}
          component="span"
          sx={{
            width: 10,
            height: 5,
            borderRadius: '2px',
            bgcolor: i < index ? 'text.primary' : i === index ? 'primary.main' : 'divider',
          }}
        />
      ))}
    </Box>
  );
}

export function StageCell({ row }: { row: ProductionOrderSummary }) {
  if (row.status !== 'New') return <ProductionOrderStatusPill status={row.status} />;
  const spread = orderStageSpread(row.stage, row.items);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, minWidth: 0 }}>
      <ProductionStagePill stage={row.stage} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <StageSteps index={spread.index} total={spread.total} />
        {spread.ahead > 0 && (
          <Typography component="span" variant="caption" color="text.secondary" noWrap>
            {spread.ahead} з {spread.itemsCount} далі
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export function ShippedCell({ row }: { row: ProductionOrderSummary }) {
  const share = row.totalQuantity > 0 ? Math.min(1, row.shippedQuantity / row.totalQuantity) : 0;
  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
      aria-label={`Відвантажено ${row.shippedQuantity} з ${row.totalQuantity} шт.`}
    >
      <Box
        aria-hidden
        sx={{ width: 48, height: 5, borderRadius: 3, bgcolor: 'divider', overflow: 'hidden' }}
      >
        <Box sx={{ width: `${share * 100}%`, height: '100%', bgcolor: 'text.primary' }} />
      </Box>
      <Box component="span" className="order-mono">
        {row.shippedQuantity} / {row.totalQuantity}
      </Box>
    </Box>
  );
}

export function DueCell({ row, today }: { row: ProductionOrderSummary; today: string }) {
  const due = dueState(row, today);
  return (
    <Box component="span" sx={{ display: 'inline-flex', flexDirection: 'column', lineHeight: 1.3 }}>
      <Box component="span" className="order-mono">
        {formatDay(row.nearestDueDate)}
      </Box>
      {due?.kind === 'overdue' && (
        <Typography component="span" variant="caption" color="error.main" sx={{ fontWeight: 600 }}>
          Прострочено {due.days} дн.
        </Typography>
      )}
      {due?.kind === 'soon' && (
        <Typography
          component="span"
          variant="caption"
          color="warning.main"
          sx={{ fontWeight: 600 }}
        >
          {due.days === 0 ? 'Сьогодні' : `Через ${due.days} дн.`}
        </Typography>
      )}
    </Box>
  );
}
