import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { PlanFactSummaryCells } from './plan-fact-summary-cells';
import { reportMono } from '../../../components/reports/expandable-row';

import type { PlanFactModel, PlanFactSummary } from '@admin/warehouse/model';
import type { KeyboardEvent } from 'react';

interface Props {
  models: readonly PlanFactModel[];
  total: PlanFactSummary;
  /** A search or a chip hides everything. */
  filtered: boolean;
  onOpen: (model: PlanFactModel) => void;
}

const activate = (event: KeyboardEvent, action: () => void) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    action();
  }
};

/**
 * «План і факт» by model: per product plan and fact, the deviation (red only above 5% overspending) and the
 * difference in metres. A model opens its tasks and fabrics in a side panel.
 */
export function PlanFactTable({ models, total, filtered, onOpen }: Props) {
  if (models.length === 0)
    return (
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography color="text.secondary">
          {filtered
            ? 'За цим пошуком, фільтром і періодом нічого немає.'
            : 'Немає завдань, тканину яких видано на всі вироби.'}
        </Typography>
      </Paper>
    );
  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{ maxHeight: 'var(--admin-table-height)', overflow: 'auto' }}
    >
      <Table
        size="small"
        stickyHeader
        aria-label="План і факт основної тканини за моделями"
        sx={{ minWidth: 720, '& td, & th': { px: 1.25 } }}
      >
        <TableHead sx={{ '& th': { bgcolor: 'background.paper' } }}>
          <TableRow>
            <TableCell>Модель</TableCell>
            <TableCell align="right" sx={{ width: 90 }}>
              Завдань
            </TableCell>
            <TableCell align="right" sx={{ width: 120 }}>
              План / виріб
            </TableCell>
            <TableCell align="right" sx={{ width: 120 }}>
              Факт / виріб
            </TableCell>
            <TableCell sx={{ width: 140 }}>Відхилення</TableCell>
            <TableCell align="right" sx={{ width: 120 }}>
              Різниця, м
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {models.map((model) => (
            <TableRow
              key={`${model.modelCode ?? ''}|${model.modelName}`}
              hover
              tabIndex={0}
              aria-label={model.modelName}
              sx={{ cursor: 'pointer' }}
              onClick={() => onOpen(model)}
              onKeyDown={(event) => activate(event, () => onOpen(model))}
            >
              <TableCell>
                <Typography variant="body2" component="span" sx={{ fontWeight: 600 }}>
                  {model.modelName}
                </Typography>
                <Typography variant="caption" color="text.secondary" component="div">
                  {model.modelCode && (
                    <Typography component="span" variant="caption" sx={reportMono}>
                      {model.modelCode} ·{' '}
                    </Typography>
                  )}
                  {model.summary.products} виробів
                </Typography>
              </TableCell>
              <PlanFactSummaryCells summary={model.summary} />
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Разом за звітом</TableCell>
            <PlanFactSummaryCells summary={total} />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
