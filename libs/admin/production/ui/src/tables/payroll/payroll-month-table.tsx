import { formatHours, formatMoney } from '@admin/production/model';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { mono } from './payroll-entry-cells';
import { PayrollMonthRow, payrollParts as parts } from './payroll-month-row';

import type { PayrollLine, PayrollTotals } from '@admin/production/model';

interface Props {
  lines: readonly PayrollLine[];
  totals: PayrollTotals;
  /** Admin on an open month: «Видано» is typed in the table. */
  canEditIssued: boolean;
  busy: boolean;
  onOpen: (line: PayrollLine) => void;
  onSaveIssued: (line: PayrollLine, raw: string) => Promise<boolean>;
}

/** «Нарахування працівникам»: what each worker earned, was paid and is due in the month. */
export function PayrollMonthTable({
  lines,
  totals,
  canEditIssued,
  busy,
  onOpen,
  onSaveIssued,
}: Props) {
  if (lines.length === 0)
    return (
      <Typography variant="body2" color="text.secondary">
        За цей місяць нарахувань немає.
      </Typography>
    );
  const shown = parts.filter((part) => lines.some((line) => line[part.key] !== 0));
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="Нарахування працівникам">
        <TableHead>
          <TableRow>
            <TableCell>Працівник</TableCell>
            <TableCell align="right">Години</TableCell>
            {shown.map((part) => (
              <TableCell key={part.key} align="right">
                {part.label}
              </TableCell>
            ))}
            <TableCell align="right">Нараховано</TableCell>
            <TableCell align="right">Виплачено</TableCell>
            <TableCell align="right">До видачі</TableCell>
            <TableCell>Видано</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lines.map((line) => (
            <PayrollMonthRow
              key={line.employeeId}
              line={line}
              parts={shown}
              canEditIssued={canEditIssued}
              busy={busy}
              onOpen={onOpen}
              onSaveIssued={onSaveIssued}
            />
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Разом</TableCell>
            <TableCell align="right" sx={mono}>
              {formatHours(totals.minutes)}
            </TableCell>
            {shown.map((part) => (
              <TableCell key={part.key} align="right" sx={mono}>
                {formatMoney(totals[part.key])}
              </TableCell>
            ))}
            <TableCell align="right" sx={mono}>
              {formatMoney(totals.accrued)}
            </TableCell>
            <TableCell align="right" sx={mono}>
              {formatMoney(totals.paid)}
            </TableCell>
            <TableCell align="right" sx={mono}>
              {formatMoney(totals.due)}
            </TableCell>
            <TableCell sx={mono}>{formatMoney(totals.issued)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
