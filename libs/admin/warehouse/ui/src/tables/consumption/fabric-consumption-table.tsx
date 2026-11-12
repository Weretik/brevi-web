import { formatMetersNumber, formatMoney } from '@admin/warehouse/model';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';

import type { ConsumptionSortKey, FabricConsumptionRow } from '@admin/warehouse/model';

interface Props {
  rows: readonly FabricConsumptionRow[];
  /** «Видано, грн» for people who see prices. */
  seesValue: boolean;
  /** A search hides everything. */
  filtered: boolean;
  sort: { key: ConsumptionSortKey; descending: boolean };
  onSort: (key: ConsumptionSortKey) => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

const columns: [ConsumptionSortKey, string][] = [
  ['received', 'Прийшло'],
  ['issuedToTasks', 'На завдання'],
  ['oneOff', 'Разова'],
  ['corrected', 'Уточнення'],
];

/** A zero is a dash, so the metres that moved stand out. */
const metres = (value: number) => (value === 0 ? '—' : formatMetersNumber(value));

/** «Витрата за період»: received, issued to tasks, one-off and corrected metres of each pair; columns sort. */
export function FabricConsumptionTable({ rows, seesValue, filtered, sort, onSort }: Props) {
  if (rows.length === 0)
    return (
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography color="text.secondary">
          {filtered ? 'За цим пошуком нічого немає.' : 'За цей період рухів немає.'}
        </Typography>
      </Paper>
    );
  const sortCell = (key: ConsumptionSortKey, label: string, align?: 'right') => (
    <TableCell
      key={key}
      align={align}
      sortDirection={sort.key === key ? (sort.descending ? 'desc' : 'asc') : false}
      sx={align ? { width: 130 } : undefined}
    >
      <TableSortLabel
        active={sort.key === key}
        direction={sort.key === key && sort.descending ? 'desc' : 'asc'}
        onClick={() => onSort(key)}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );
  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{ maxHeight: 'var(--admin-table-height)', overflow: 'auto' }}
    >
      <Table
        stickyHeader
        size="small"
        aria-label="Витрата за період"
        sx={{ minWidth: 720, '& td, & th': { px: 1.25 } }}
      >
        <TableHead sx={{ '& th': { bgcolor: 'background.paper' } }}>
          <TableRow>
            {sortCell('name', 'Тканина · колір')}
            {columns.map(([key, label]) => sortCell(key, `${label}, м`, 'right'))}
            {seesValue && (
              <TableCell align="right" sx={{ width: 140 }}>
                Видано, грн
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.stockId} hover>
              <TableCell>
                <Typography variant="body2" component="span" sx={{ fontWeight: 600 }}>
                  {row.fabricName}
                </Typography>{' '}
                · {row.color}
                <Typography variant="caption" color="text.secondary" component="div" sx={mono}>
                  {row.fabricCode}
                </Typography>
              </TableCell>
              <TableCell
                align="right"
                sx={{ ...mono, color: row.received > 0 ? 'success.main' : undefined }}
              >
                {metres(row.received)}
              </TableCell>
              <TableCell align="right" sx={mono}>
                {metres(row.issuedToTasks)}
              </TableCell>
              <TableCell align="right" sx={mono}>
                {metres(row.oneOff)}
              </TableCell>
              <TableCell
                align="right"
                sx={{ ...mono, color: row.corrected < 0 ? 'error.main' : undefined }}
              >
                {row.corrected > 0 ? `+${metres(row.corrected)}` : metres(row.corrected)}
              </TableCell>
              {seesValue && (
                <TableCell align="right" sx={mono}>
                  {formatMoney(row.issuedValue)}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
