import { formatDay, formatQuantity, hardwareUnitLabel } from '@admin/warehouse/model';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

import { reportMono } from '../../components/reports/expandable-row';
import { OrderLink } from '../../components/reports/order-link';

import type { HardwareNeed } from '@admin/warehouse/model';

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
