import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import { OrderLink } from '../../../components/reports/order-link';

import type { HardwareIncomplete } from '@admin/warehouse/model';

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
