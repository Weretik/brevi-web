import {
  formatDay,
  formatQuantity,
  hardwareTasks,
  hardwareUnitLabel,
} from '@admin/warehouse/model';
import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { reportMono } from '../../../components/reports/expandable-row';

import type { HardwareNeed } from '@admin/warehouse/model';
import type { KeyboardEvent } from 'react';

interface Props {
  needs: readonly HardwareNeed[];
  /** A search or a chip hides everything. */
  filtered: boolean;
  onOpen: (need: HardwareNeed) => void;
}

const activate = (event: KeyboardEvent, action: () => void) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    action();
  }
};

/** Distinct tasks of a need. */

/**
 * «Що замовити › Фурнітура»: one row per accessory with its need and unit, the nearest due date and how many tasks
 * need it; a name missing from the reference is marked. A row opens the breakdown in a side panel.
 */
export function HardwareNeedTable({ needs, filtered, onOpen }: Props) {
  if (needs.length === 0)
    return (
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography color="text.secondary">
          {filtered
            ? 'За цим пошуком і фільтром нічого немає.'
            : 'Відкриті замовлення не потребують фурнітури.'}
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
        aria-label="Що замовити: фурнітура"
        sx={{ minWidth: 720, '& td, & th': { px: 1.25 } }}
      >
        <TableHead sx={{ '& th': { bgcolor: 'background.paper' } }}>
          <TableRow>
            <TableCell>Фурнітура</TableCell>
            <TableCell>Варіант / примітка</TableCell>
            <TableCell sx={{ width: 140 }}>Найближчий термін</TableCell>
            <TableCell align="right" sx={{ width: 90 }}>
              Завдань
            </TableCell>
            <TableCell align="right" sx={{ width: 150 }}>
              Потреба
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {needs.map((need) => (
            <TableRow
              key={`${need.code}|${need.name}|${need.note ?? ''}|${need.unit}`}
              hover
              tabIndex={0}
              aria-label={`${need.name}, ${need.code}`}
              sx={{ cursor: 'pointer' }}
              onClick={() => onOpen(need)}
              onKeyDown={(event) => activate(event, () => onOpen(need))}
            >
              <TableCell>
                <Typography variant="body2" component="span" sx={{ fontWeight: 600 }}>
                  {need.name}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  component="div"
                  sx={reportMono}
                >
                  {need.code}
                </Typography>
                {!need.nameChecked && (
                  <Chip
                    size="small"
                    color="warning"
                    variant="outlined"
                    label="Назву не знайдено в довіднику"
                    sx={{ mt: 0.5 }}
                  />
                )}
              </TableCell>
              <TableCell>
                {need.note ?? (
                  <Typography variant="body2" color="text.secondary" component="span">
                    —
                  </Typography>
                )}
              </TableCell>
              <TableCell sx={reportMono}>
                {need.dueDate ? (
                  formatDay(need.dueDate)
                ) : (
                  <Typography variant="body2" color="text.secondary" component="span">
                    без терміну
                  </Typography>
                )}
              </TableCell>
              <TableCell align="right" sx={reportMono}>
                {hardwareTasks(need)}
              </TableCell>
              <TableCell align="right" sx={{ ...reportMono, fontWeight: 600 }}>
                {formatQuantity(need.quantity)} {hardwareUnitLabel(need.unit)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
