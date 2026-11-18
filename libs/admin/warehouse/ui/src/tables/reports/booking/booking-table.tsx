import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { BookingTableRow } from './booking-table-row';

import type { BookingPair } from '@admin/warehouse/model';

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
          {pairs.map((pair) => (
            <BookingTableRow
              key={`${pair.fabricCode}|${pair.color}`}
              pair={pair}
              today={today}
              onReceive={onReceive}
              onOpen={onOpen}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
