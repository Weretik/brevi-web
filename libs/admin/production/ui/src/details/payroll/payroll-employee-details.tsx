import {
  formatDay,
  formatHours,
  formatMoney,
  productionWorkKindLabels,
} from '@admin/production/model';
import {
  Box,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { PayrollAdjustmentsTable, PayrollPaymentsTable } from '../../tables/payroll/payroll-entries-tables';

import type { PayrollEmployee, PayrollWorkRow } from '@admin/production/model';

const mono = { fontFamily: 'var(--admin-font-mono)', whiteSpace: 'nowrap' } as const;

function WorkTable({ title, rows }: { title: string; rows: readonly PayrollWorkRow[] }) {
  if (rows.length === 0) return null;
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small" aria-label={title}>
          <TableHead>
            <TableRow>
              <TableCell>Дата</TableCell>
              <TableCell>Завдання</TableCell>
              <TableCell>Робота</TableCell>
              <TableCell align="right">Шт.</TableCell>
              <TableCell align="right">Розцінка</TableCell>
              <TableCell align="right">Сума</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.workId}>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDay(row.workDate)}</TableCell>
                <TableCell>
                  <Link href={`/production/orders/${row.orderId}`}>
                    № {row.orderNumber}
                  </Link>{' '}
                  · {row.modelName}
                </TableCell>
                <TableCell>{productionWorkKindLabels[row.kind]}</TableCell>
                <TableCell align="right" sx={mono}>
                  {row.quantity}
                </TableCell>
                <TableCell align="right" sx={mono}>
                  {formatMoney(row.rate)}
                </TableCell>
                <TableCell align="right" sx={mono}>
                  {formatMoney(row.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

/** A worker's month: the parts of the pay, the work behind it, payments and adjustments. */
export function PayrollEmployeeDetails({ detail }: { detail: PayrollEmployee }) {
  const line = detail.line;
  const parts: [string, number][] = [
    ['Пошив', line.sewing],
    ['Крій', line.cutting],
    ['Премія', line.bonus],
    ['Майстер', line.master],
    ['Начальник', line.chief],
    ['Вишивка', line.embroidery],
    ['Інше', line.other],
  ];
  const planned = detail.work.filter((row) => !row.overPlan);
  const overPlan = detail.work.filter((row) => row.overPlan);
  return (
    <Stack sx={{ gap: 2.5 }}>
      <Paper variant="outlined" sx={{ p: 1.5 }}>
        <Stack sx={{ gap: 0.5 }}>
          {parts
            .filter(([, value]) => value !== 0)
            .map(([label, value]) => (
              <Stack key={label} direction="row" sx={{ justifyContent: 'space-between' }}>
                <Typography variant="body2">{label}</Typography>
                <Typography variant="body2" sx={mono}>
                  {formatMoney(value)}
                </Typography>
              </Stack>
            ))}
          <Stack direction="row" sx={{ justifyContent: 'space-between', pt: 0.5 }}>
            <Typography variant="subtitle2">Нараховано</Typography>
            <Typography variant="subtitle2" sx={mono}>
              {formatMoney(line.accrued)}
            </Typography>
          </Stack>
          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Typography variant="body2">Виплачено</Typography>
            <Typography variant="body2" sx={mono}>
              {formatMoney(line.paid)}
            </Typography>
          </Stack>
          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Typography variant="subtitle2">До видачі</Typography>
            <Typography variant="subtitle2" sx={mono}>
              {formatMoney(line.due)}
            </Typography>
          </Stack>
          {line.minutes > 0 && (
            <Typography variant="caption" color="text.secondary">
              Відпрацьовано {formatHours(line.minutes)} год; години на зарплату не впливають.
            </Typography>
          )}
        </Stack>
      </Paper>
      <WorkTable title="Робота за завданням" rows={planned} />
      <WorkTable title="Понад завдання" rows={overPlan} />
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Виплати
        </Typography>
        <PayrollPaymentsTable rows={detail.payments} showEmployee={false} />
      </Box>
      {detail.adjustments.length > 0 && (
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Інше нарахування / утримання
          </Typography>
          <PayrollAdjustmentsTable rows={detail.adjustments} showEmployee={false} />
        </Box>
      )}
    </Stack>
  );
}
