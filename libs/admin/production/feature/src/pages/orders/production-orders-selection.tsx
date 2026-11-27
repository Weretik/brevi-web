import { ordersWord } from '@admin/production/model';
import { ProductionOrderChips, ProductionOrderFilterChips } from '@admin/production/ui';
import { Box, Stack, Typography } from '@mui/material';

import type { useProductionOrdersPage } from '../../hooks/orders-list/use-production-orders-page';

type OrdersPage = ReturnType<typeof useProductionOrdersPage>;

interface Props {
  list: OrdersPage['list'];
  page: OrdersPage['page'];
  attention: OrdersPage['attention'];
}

/** The status and urgency chips, the chips of the chosen filters and «Знайдено N завдань · M шт. виробів». */
export function ProductionOrdersSelection({ list, page, attention }: Props) {
  return (
    <Stack
      direction="row"
      sx={{ gap: 1, flexWrap: 'wrap', alignItems: 'center', my: 1.5 }}
      aria-label="Відбір завдань"
      role="group"
    >
      <ProductionOrderChips
        counts={page?.counts ?? { all: 0, new: 0, closed: 0, cancelled: 0 }}
        status={list.urgency ? undefined : list.status}
        overdue={list.urgency === 'overdue'}
        overdueCount={attention.overdue}
        dueSoon={list.urgency === 'dueSoon'}
        dueSoonCount={attention.overdue + attention.dueSoon}
        onStatusChange={list.setStatus}
        onOverdueChange={(on) => list.setUrgency(on ? 'overdue' : null)}
        onDueSoonChange={(on) => list.setUrgency(on ? 'dueSoon' : null)}
      />
      <ProductionOrderFilterChips
        values={list.filters}
        options={list.filterOptions}
        manager={list.manager}
        stage={list.stage}
        onChange={list.setFilter}
        onManagerChange={list.setManager}
        onStageChange={list.setStage}
      />
      <Box sx={{ flexGrow: 1 }} />
      {page && (
        <Typography variant="body2" color="text.secondary" aria-live="polite">
          Знайдено {page.total} {ordersWord(page.total)} ·{' '}
          {page.totalQuantity.toLocaleString('uk-UA')} шт. виробів
        </Typography>
      )}
    </Stack>
  );
}
