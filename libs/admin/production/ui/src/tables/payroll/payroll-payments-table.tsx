import { formatDay, formatMoney, payrollPaymentKindLabels } from '@admin/production/model';
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

import {
  PayrollEntryCancelButton,
  PayrollEntryCancelProps,
  cancelled,
  mono,
} from './payroll-entry-cells';

import type { PayrollPayment } from '@admin/production/model';

/** «Виплати» of a month; a cancelled one stays crossed out. */
export function PayrollPaymentsTable({
  rows,
  onCancel,
  busy = false,
  showEmployee = true,
}: { rows: readonly PayrollPayment[] } & PayrollEntryCancelProps<PayrollPayment>) {
  if (rows.length === 0)
    return (
      <Typography variant="body2" color="text.secondary">
        Виплат ще немає.
      </Typography>
    );
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="Виплати">
        <TableHead>
          <TableRow>
            <TableCell>Дата</TableCell>
            {showEmployee && <TableCell>Працівник</TableCell>}
            <TableCell>Вид</TableCell>
            <TableCell align="right">Сума</TableCell>
            <TableCell>Деталі</TableCell>
            {onCancel && <TableCell padding="checkbox" />}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            const voided = row.voidedAt !== null;
            return (
              <TableRow key={row.id} sx={{ opacity: voided ? 0.6 : 1 }}>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDay(row.paidOn)}</TableCell>
                {showEmployee && <TableCell>{row.employeeName}</TableCell>}
                <TableCell>{payrollPaymentKindLabels[row.kind]}</TableCell>
                <TableCell
                  align="right"
                  sx={{ ...mono, textDecoration: voided ? 'line-through' : undefined }}
                >
                  {formatMoney(row.amount)}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {[row.comment, `${row.createdByName}`, voided ? cancelled(row) : null]
                      .filter(Boolean)
                      .join(' · ')}
                  </Typography>
                </TableCell>
                {onCancel && (
                  <TableCell padding="checkbox">
                    {!voided && (
                      <PayrollEntryCancelButton
                        label={`Скасувати виплату ${row.employeeName} ${formatDay(row.paidOn)}`}
                        busy={busy}
                        onClick={() => onCancel(row)}
                      />
                    )}
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
