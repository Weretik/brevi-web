import { formatQuantity, hardwareUnitLabel } from '@admin/warehouse/model';
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

import { ExpandableRow, reportMono } from '../../components/reports/expandable-row';
import { OrderLink } from '../../components/reports/order-link';

import type { HardwareIncomplete, HardwareNeed } from '@admin/warehouse/model';

interface Props {
  needs: readonly HardwareNeed[];
}

/** «Фурнітура», «Варіант / примітка», «Одиниця», «Потреба»; each opens its shares by order. */
export function HardwareNeedTable({ needs }: Props) {
  if (needs.length === 0)
    return (
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography color="text.secondary">Відкриті замовлення не потребують фурнітури.</Typography>
      </Paper>
    );
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="Зведена потреба у фурнітурі">
        <TableHead>
          <TableRow sx={{ bgcolor: 'action.hover' }}>
            <TableCell />
            <TableCell>Фурнітура</TableCell>
            <TableCell>Варіант / примітка</TableCell>
            <TableCell>Одиниця</TableCell>
            <TableCell align="right">Потреба</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {needs.map((need) => {
            const unit = hardwareUnitLabel(need.unit);
            return (
              <ExpandableRow
                key={`${need.code}|${need.name}|${need.note ?? ''}|${need.unit}`}
                label={`${need.name}, ${need.code}`}
                columns={5}
                cells={
                  <>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {need.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={reportMono}>
                        {need.code}
                      </Typography>
                      {!need.nameChecked && (
                        <Typography variant="caption" color="warning.main" component="div">
                          Назву не підтверджено
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{need.note ?? '—'}</TableCell>
                    <TableCell>{unit}</TableCell>
                    <TableCell align="right" sx={{ ...reportMono, fontWeight: 600 }}>
                      {formatQuantity(need.quantity)} {unit}
                    </TableCell>
                  </>
                }
              >
                <Table size="small" aria-label={`Замовлення: ${need.name}`}>
                  <TableBody>
                    {need.orders.map((share) => (
                      <TableRow key={share.itemId}>
                        <TableCell>
                          <OrderLink orderId={share.orderId} orderNumber={share.orderNumber} /> ·{' '}
                          {share.clientName}
                        </TableCell>
                        <TableCell>{share.modelName}</TableCell>
                        <TableCell align="right" sx={reportMono}>
                          {formatQuantity(share.norm)} × {share.products} ={' '}
                          {formatQuantity(share.quantity)} {unit}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ExpandableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
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
