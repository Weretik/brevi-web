import { ModelSummarySortEditor, ProductionModelSummaryTable } from '@admin/production/ui';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Alert, Box, Button, Collapse, LinearProgress, Paper, Stack } from '@mui/material';
import { useState } from 'react';

import type { useProductionModelSummary } from '../../hooks/orders-list/use-production-model-summary';
import type { ComponentProps } from 'react';

type SummaryRow = Parameters<ComponentProps<typeof ProductionModelSummaryTable>['onView']>[0];

interface Props {
  summary: Pick<
    ReturnType<typeof useProductionModelSummary>,
    'rows' | 'totalQuantity' | 'loading' | 'error' | 'sort' | 'setSort' | 'reload'
  >;
  onView: (row: SummaryRow) => void;
}

/** «Зведення за моделями» on «Виробничі завдання»: the priority sort, then quantities per model. */
export function ProductionModelSummaryView({ summary, onView }: Props) {
  const [sortOpen, setSortOpen] = useState(false);

  return (
    <Stack spacing={1.5}>
      <Paper variant="outlined" sx={{ px: 2, py: 1 }}>
        <Button
          size="small"
          aria-expanded={sortOpen}
          endIcon={sortOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          onClick={() => setSortOpen(!sortOpen)}
        >
          Сортування за пріоритетом ({summary.sort.length})
        </Button>
        <Collapse in={sortOpen} unmountOnExit>
          <Box sx={{ pt: 1, pb: 1 }}>
            <ModelSummarySortEditor levels={summary.sort} onChange={summary.setSort} />
          </Box>
        </Collapse>
      </Paper>
      {summary.error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => void summary.reload()}>
              Повторити
            </Button>
          }
        >
          {summary.error}
        </Alert>
      )}
      {summary.loading && <LinearProgress aria-label="Завантаження зведення" />}
      {!summary.loading && !summary.error && (
        <ProductionModelSummaryTable
          rows={summary.rows}
          totalQuantity={summary.totalQuantity}
          onView={onView}
        />
      )}
    </Stack>
  );
}
