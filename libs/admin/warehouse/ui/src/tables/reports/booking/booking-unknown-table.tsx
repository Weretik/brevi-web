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

import { OrderLink } from '../../../components/reports/order-link';

import type { BookingUnknown } from '@admin/warehouse/model';

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
