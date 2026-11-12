import { bookingCoverage, formatDay, formatMetersNumber, isDueSoon } from '@admin/warehouse/model';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import {
  Box,
  Button,
  Chip,
  LinearProgress,
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

import type { BookingPair, BookingUnknown } from '@admin/warehouse/model';
import type { KeyboardEvent } from 'react';

interface Props {
  pairs: readonly BookingPair[];
  /** A search or a chip hides everything: say so instead of «нічого не потрібно». */
  filtered: boolean;
  /** Today in Kyiv, yyyy-mm-dd: a «Потрібно до» within three days is red. */
  today: string;
  /** «+ Прихід» on each row; null when the person may not record it. */
  onReceive: ((pair: BookingPair) => void) | null;
  onOpen: (pair: BookingPair) => void;
}

const number = formatMetersNumber;

/** The task whose date is «Потрібно до». */
const dueTask = (pair: BookingPair) =>
  pair.needBy === null ? undefined : pair.items.find((x) => x.dueDate === pair.needBy);

const activate = (event: KeyboardEvent, action: () => void) => {
  if (event.target !== event.currentTarget) return;
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    action();
  }
};

/**
 * «Що замовити › Тканина»: one row per fabric and colour with its supplier, the nearest date it is needed by, how
 * much of the need the stock covers and what to order. A row opens the queue of tasks in a side panel.
 */
export function BookingTable({ pairs, filtered, today, onReceive, onOpen }: Props) {
  if (pairs.length === 0)
    return (
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography color="text.secondary">
          {filtered
            ? 'За цим пошуком і фільтром нічого немає.'
            : 'Відкриті завдання нічого не потребують.'}
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
        aria-label="Що замовити: тканина"
        sx={{ minWidth: 820, '& td, & th': { px: 1.25 } }}
      >
        <TableHead sx={{ '& th': { bgcolor: 'background.paper' } }}>
          <TableRow>
            <TableCell>Тканина · колір</TableCell>
            <TableCell sx={{ width: 160 }}>Постачальник</TableCell>
            <TableCell sx={{ width: 150 }}>Потрібно до</TableCell>
            <TableCell sx={{ width: 180 }}>Покриття</TableCell>
            <TableCell align="right" sx={{ width: 120 }}>
              Замовити, м
            </TableCell>
            {onReceive && <TableCell sx={{ width: 120 }} />}
          </TableRow>
        </TableHead>
        <TableBody>
          {pairs.map((pair) => {
            const task = dueTask(pair);
            const soon = pair.toOrder > 0 && isDueSoon(pair.needBy, today);
            const coverage = bookingCoverage(pair);
            return (
              <TableRow
                key={`${pair.fabricCode}|${pair.color}`}
                hover
                tabIndex={0}
                aria-label={`${pair.fabricName}, ${pair.color}`}
                sx={{ cursor: 'pointer' }}
                onClick={() => onOpen(pair)}
                onKeyDown={(event) => activate(event, () => onOpen(pair))}
              >
                <TableCell>
                  <Typography variant="body2" component="span" sx={{ fontWeight: 600 }}>
                    {pair.fabricName} · {pair.color}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    component="div"
                    sx={reportMono}
                  >
                    {pair.fabricCode}
                  </Typography>
                  {pair.shortage > 0 && (
                    <Chip
                      size="small"
                      color="error"
                      variant="outlined"
                      label={`На складі мінус ${number(pair.shortage)} м`}
                      sx={{ mt: 0.5 }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {pair.supplier ?? (
                    <Typography variant="body2" color="text.secondary" component="span">
                      —
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {pair.needBy ? (
                    <>
                      <Typography
                        variant="body2"
                        sx={{ ...reportMono, color: soon ? 'error.main' : undefined }}
                      >
                        {formatDay(pair.needBy)}
                      </Typography>
                      {task && (
                        <Typography variant="caption" color="text.secondary" component="div">
                          <Box component="span" onClick={(event) => event.stopPropagation()}>
                            <OrderLink orderId={task.orderId} orderNumber={task.orderNumber} />
                          </Box>{' '}
                          · {task.clientName}
                        </Typography>
                      )}
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      без терміну
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <LinearProgress
                    variant="determinate"
                    value={coverage * 100}
                    color={coverage < 1 ? 'warning' : 'primary'}
                    aria-label={`Покриття ${Math.round(coverage * 100)}%`}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={reportMono}>
                    є {number(pair.reserved)} з {number(pair.need)}
                  </Typography>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    ...reportMono,
                    fontWeight: 600,
                    color: pair.toOrder > 0 ? 'error.main' : 'text.secondary',
                  }}
                >
                  {pair.toOrder > 0 ? number(pair.toOrder) : '—'}
                </TableCell>
                {onReceive && (
                  <TableCell align="right">
                    <Button
                      size="small"
                      startIcon={<AddOutlinedIcon />}
                      aria-label={`Прихід: ${pair.fabricName}, ${pair.color}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        onReceive(pair);
                      }}
                    >
                      Прихід
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

/** «Без плану»: items whose need is unknown, not counted as zero. */
export function BookingUnknownTable({ rows }: { rows: readonly BookingUnknown[] }) {
  if (rows.length === 0)
    return (
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography color="text.secondary">У всіх позицій план відомий.</Typography>
      </Paper>
    );
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="Без плану">
        <TableHead>
          <TableRow sx={{ bgcolor: 'action.hover' }}>
            <TableCell>Завдання / замовник</TableCell>
            <TableCell>Модель</TableCell>
            <TableCell>Чому потреба невідома</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={`${row.itemId}|${index}`}>
              <TableCell>
                <OrderLink orderId={row.orderId} orderNumber={row.orderNumber} /> · {row.clientName}
              </TableCell>
              <TableCell>{row.modelName}</TableCell>
              <TableCell>{row.reason}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
