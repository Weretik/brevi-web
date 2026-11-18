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

import { FabricMovementTableRow } from './fabric-movement-table-row';

import type { FabricMovementRow } from '@admin/warehouse/model';

interface Props {
  rows: readonly FabricMovementRow[];
  /** A filter hides everything: say so instead of «рухів ще немає». */
  filtered: boolean;
  /** A row opens its side panel: details, edits, «Відмінити операцію…» and the history. */
  onOpen: (row: FabricMovementRow) => void;
}

/**
 * «Рух тканини» as a compact journal, newest operation date first: one line per movement, the signed quantity and
 * «Залишок пари» (every code of the fabric in this colour after it). A row opens its side panel; only a problem is
 * marked: a cancelled movement or a balance below zero.
 */
export function FabricMovementsTable({ rows, filtered, onOpen }: Props) {
  if (rows.length === 0)
    return (
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography color="text.secondary">
          {filtered ? 'За цим фільтром рухів немає.' : 'Рухів тканини ще немає.'}
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
        aria-label="Рух тканини"
        sx={{ minWidth: 860, '& td, & th': { px: 1.25 } }}
      >
        <TableHead sx={{ '& th': { bgcolor: 'background.paper' } }}>
          <TableRow>
            <TableCell>Дата</TableCell>
            <TableCell>Операція</TableCell>
            <TableCell>Тканина · колір</TableCell>
            <TableCell>Звідки / куди</TableCell>
            <TableCell align="right">Кількість</TableCell>
            <TableCell align="right">Залишок пари</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <FabricMovementTableRow key={row.id} row={row} onOpen={onOpen} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
