import { formatDay, formatQuantity, hardwareUnitLabel } from '@admin/warehouse/model';
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

import { reportMono } from '../../components/reports/expandable-row';
import { OrderLink } from '../../components/reports/order-link';

import type { HardwareIncomplete, HardwareNeed } from '@admin/warehouse/model';
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
export const hardwareTasks = (need: HardwareNeed) =>
  new Set(need.orders.map((x) => x.orderId)).size;

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

/** The breakdown of a need by task: norm × products. */
export function HardwareNeedShares({ need }: { need: HardwareNeed }) {
  const unit = hardwareUnitLabel(need.unit);
  return (
    <Table size="small" aria-label={`Розрахунок: ${need.name}`}>
      <TableHead>
        <TableRow>
          <TableCell>Завдання</TableCell>
          <TableCell>Модель</TableCell>
          <TableCell align="right">Норма × виробів</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {need.orders.map((share) => (
          <TableRow key={share.itemId}>
            <TableCell>
              <OrderLink orderId={share.orderId} orderNumber={share.orderNumber} /> ·{' '}
              {share.clientName}
              {share.dueDate && (
                <Typography variant="caption" color="text.secondary" component="div">
                  до {formatDay(share.dueDate)}
                </Typography>
              )}
            </TableCell>
            <TableCell>{share.modelName}</TableCell>
            <TableCell align="right" sx={reportMono}>
              {formatQuantity(share.norm)} × {share.products} = {formatQuantity(share.quantity)}{' '}
              {unit}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/** «Потреба неповна»: lines whose quantity is unknown, never zero. */
export function HardwareIncompleteTable({ rows }: { rows: readonly HardwareIncomplete[] }) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="Потреба неповна">
        <TableHead>
          <TableRow sx={{ bgcolor: 'action.hover' }}>
            <TableCell>Замовлення / замовник</TableCell>
            <TableCell>Модель</TableCell>
            <TableCell>Рядок складу</TableCell>
            <TableCell>Причина</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={`${row.itemId}|${row.code ?? ''}|${index}`}>
              <TableCell>
                <OrderLink orderId={row.orderId} orderNumber={row.orderNumber} /> · {row.clientName}
              </TableCell>
              <TableCell>{row.modelName}</TableCell>
              <TableCell>{[row.code, row.name].filter(Boolean).join(' · ') || '—'}</TableCell>
              <TableCell>{row.reason}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
