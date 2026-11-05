import { formatDay, formatMoney, payrollPaymentKindLabels } from '@admin/production/model';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';

import type { PayrollAdjustment, PayrollPayment } from '@admin/production/model';

const mono = { fontFamily: 'var(--admin-font-mono)', whiteSpace: 'nowrap' } as const;

const cancelled = (row: { voidedByName: string | null; voidReason: string | null }) =>
  `Скасовано${row.voidedByName ? ` · ${row.voidedByName}` : ''}${row.voidReason ? `: ${row.voidReason}` : ''}`;

interface CancelProps<Row> {
  /** Absent: the person may not cancel. */
  onCancel?: (row: Row) => void;
  busy?: boolean;
  /** Show the worker: the month lists everyone, a worker's card one person. */
  showEmployee?: boolean;
}

function CancelButton({
  label,
  busy,
  onClick,
}: {
  label: string;
  busy: boolean;
  onClick: () => void;
}) {
  return (
    <Tooltip title="Скасувати">
      <span>
        <IconButton size="small" aria-label={label} disabled={busy} onClick={onClick}>
          <UndoOutlinedIcon fontSize="small" />
        </IconButton>
      </span>
    </Tooltip>
  );
}

/** «Виплати» of a month; a cancelled one stays crossed out. */
export function PayrollPaymentsTable({
  rows,
  onCancel,
  busy = false,
  showEmployee = true,
}: { rows: readonly PayrollPayment[] } & CancelProps<PayrollPayment>) {
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
                      <CancelButton
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

/** «Інше нарахування / утримання» of a month; a deduction is negative. */
export function PayrollAdjustmentsTable({
  rows,
  onCancel,
  busy = false,
  showEmployee = true,
}: { rows: readonly PayrollAdjustment[] } & CancelProps<PayrollAdjustment>) {
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
                      <CancelButton
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
