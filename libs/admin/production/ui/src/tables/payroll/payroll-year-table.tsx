import { formatMoney } from '@admin/production/model';
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

import type { PayrollYear } from '@admin/production/model';

const short = ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'];
const mono = { fontFamily: 'var(--admin-font-mono)', whiteSpace: 'nowrap' } as const;

interface Props {
  year: PayrollYear;
  /** «2026-11»: months before it should be closed. */
  currentMonth: string;
}

/** «Історія за рік»: what each worker earned per month; a past month not closed is marked. */
export function PayrollYearTable({ year, currentMonth }: Props) {
  if (year.rows.length === 0)
    return (
      <Typography variant="body2" color="text.secondary">
        За {year.year} рік нарахувань немає.
      </Typography>
    );
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label={`Зарплата за ${year.year} рік`}>
        <TableHead>
          <TableRow>
            <TableCell>Працівник</TableCell>
            {short.map((name, index) => {
              const month = year.months[index];
              const notClosed = month && !month.isClosed && month.month < currentMonth;
              return (
                <TableCell key={name} align="right">
                  {name}
                  {notClosed && (
                    <Typography variant="caption" color="warning.main" component="div">
                      не закрито
                    </Typography>
                  )}
                </TableCell>
              );
            })}
            <TableCell align="right">Разом</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {year.rows.map((row) => (
            <TableRow key={row.employeeId}>
              <TableCell>
                {row.name}
                <Typography variant="caption" color="text.secondary" component="div">
                  {row.position}
                </Typography>
              </TableCell>
              {short.map((name, index) => (
                <TableCell key={name} align="right" sx={mono}>
                  {row.accrued[index] == null ? '—' : formatMoney(row.accrued[index] ?? 0)}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ ...mono, fontWeight: 700 }}>
                {formatMoney(row.total)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Разом</TableCell>
            {short.map((name, index) => (
              <TableCell key={name} align="right" sx={mono}>
                {year.months[index] ? formatMoney(year.months[index]?.accrued ?? 0) : '—'}
              </TableCell>
            ))}
            <TableCell align="right" sx={mono}>
              {formatMoney(year.rows.reduce((sum, row) => sum + row.total, 0))}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
