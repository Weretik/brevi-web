import { formatMoney } from '@admin/production/model';
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

import type { PayrollAdjustment } from '@admin/production/model';

/** «Інше нарахування / утримання» of a month; a deduction is negative. */
export function PayrollAdjustmentsTable({
  rows,
  onCancel,
  busy = false,
  showEmployee = true,
}: { rows: readonly PayrollAdjustment[] } & PayrollEntryCancelProps<PayrollAdjustment>) {
  if (rows.length === 0)
    return (
      <Typography variant="body2" color="text.secondary">
        Інших нарахувань і утримань немає.
      </Typography>
    );
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="Інші нарахування й утримання">
        <TableHead>
          <TableRow>
            {showEmployee && <TableCell>Працівник</TableCell>}
            <TableCell align="right">Сума</TableCell>
            <TableCell>Причина</TableCell>
            {onCancel && <TableCell padding="checkbox" />}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            const voided = row.voidedAt !== null;
            return (
              <TableRow key={row.id} sx={{ opacity: voided ? 0.6 : 1 }}>
                {showEmployee && <TableCell>{row.employeeName}</TableCell>}
                <TableCell
                  align="right"
                  sx={{
                    ...mono,
                    color: row.amount < 0 ? 'error.main' : undefined,
                    textDecoration: voided ? 'line-through' : undefined,
                  }}
                >
                  {formatMoney(row.amount)}
                </TableCell>
                <TableCell>
                  {row.reason}
                  <Typography variant="caption" color="text.secondary" component="div">
                    {[row.createdByName, voided ? cancelled(row) : null]
                      .filter(Boolean)
                      .join(' · ')}
                  </Typography>
                </TableCell>
                {onCancel && (
                  <TableCell padding="checkbox">
                    {!voided && (
                      <PayrollEntryCancelButton
                        label={`Скасувати запис ${row.employeeName}: ${row.reason}`}
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
