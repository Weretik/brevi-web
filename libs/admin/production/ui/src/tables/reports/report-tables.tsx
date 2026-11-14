import { formatDay, formatMeters, formatMoney } from '@admin/production/model';
import {
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import type {
  ReportIssueRow,
  ReportOutputRow,
  ReportStaffRow,
  ReportStockRow,
} from '@admin/production/model';
import type { ReactNode } from 'react';

const mono = { fontFamily: 'var(--admin-font-mono)', whiteSpace: 'nowrap' } as const;
const unknown = (
  <Typography component="span" variant="body2" color="warning.main">
    ціна невідома
  </Typography>
);
const hours = (minutes: number) =>
  (minutes / 60).toLocaleString('uk-UA', { maximumFractionDigits: 2 });

interface Column<Row> {
  label: string;
  numeric?: boolean;
  cell: (row: Row) => ReactNode;
}

function ReportTable<Row>({
  label,
  empty,
  rows,
  rowKey,
  columns,
}: {
  label: string;
  empty: string;
  rows: Row[];
  rowKey: (row: Row) => number;
  columns: Column<Row>[];
}) {
  if (rows.length === 0)
    return (
      <Typography variant="body2" color="text.secondary">
        {empty}
      </Typography>
    );
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label={label}>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.label} align={column.numeric ? 'right' : 'left'}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={rowKey(row)}>
              {columns.map((column) => (
                <TableCell
                  key={column.label}
                  align={column.numeric ? 'right' : 'left'}
                  sx={column.numeric ? mono : undefined}
                >
                  {column.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const order = (id: number | null, number: number | null) =>
  id === null || number === null ? '—' : <Link href={`/production/orders/${id}`}>№{number}</Link>;

/** «Випуск»: pieces sewn within the plan at the КП price. */
export function ReportOutputTable({ rows }: { rows: ReportOutputRow[] }) {
  return (
    <ReportTable
      label="Випуск за завданнями"
      empty="За період нічого не пошито."
      rows={rows}
      rowKey={(row) => row.itemId}
      columns={[
        { label: 'Завдання', cell: (row) => order(row.orderId, row.orderNumber) },
        { label: 'Замовник', cell: (row) => row.clientName },
        { label: 'Модель', cell: (row) => row.modelName },
        { label: 'Пошито, шт.', numeric: true, cell: (row) => row.quantity },
        {
          label: 'Ціна КП',
          numeric: true,
          cell: (row) => (row.unitPrice === null ? unknown : formatMoney(row.unitPrice)),
        },
        {
          label: 'Вартість',
          numeric: true,
          cell: (row) => (row.value === null ? '—' : formatMoney(row.value)),
        },
      ]}
    />
  );
}

/** «Працівники»: hours, pieces, accrued and the pay per 8 hours. */
export function ReportStaffTable({ rows }: { rows: ReportStaffRow[] }) {
  return (
    <ReportTable
      label="Працівники"
      empty="За період немає нарахувань."
      rows={rows}
      rowKey={(row) => row.employeeId}
      columns={[
        { label: 'Працівник', cell: (row) => row.name },
        { label: 'Посада', cell: (row) => row.position },
        { label: 'Години', numeric: true, cell: (row) => hours(row.minutes) },
        { label: 'Пошито, шт.', numeric: true, cell: (row) => row.sewn },
        { label: 'Розкроєно, шт.', numeric: true, cell: (row) => row.cut },
        { label: 'Нараховано', numeric: true, cell: (row) => formatMoney(row.accrued) },
        {
          label: 'За 8 годин',
          numeric: true,
          cell: (row) =>
            row.dayAverage === null ? (
              <Typography component="span" variant="body2" color="warning.main">
                немає годин
              </Typography>
            ) : (
              formatMoney(row.dayAverage)
            ),
        },
      ]}
    />
  );
}

/** «Видані матеріали»: fabric issued to order items at the price of «Тканини». */
export function ReportMaterialsTable({ rows }: { rows: ReportIssueRow[] }) {
  return (
    <ReportTable
      label="Видані матеріали"
      empty="За період тканину не видавали."
      rows={rows}
      rowKey={(row) => row.movementId}
      columns={[
        { label: 'Дата', cell: (row) => formatDay(row.issuedOn) },
        { label: 'Тканина', cell: (row) => `${row.fabricName} (${row.fabricCode})` },
        { label: 'Колір', cell: (row) => row.color },
        { label: 'Завдання', cell: (row) => order(row.orderId, row.orderNumber) },
        { label: 'Модель', cell: (row) => row.modelName ?? '—' },
        { label: 'Кількість', numeric: true, cell: (row) => formatMeters(row.meters) },
        {
          label: 'Ціна за м',
          numeric: true,
          cell: (row) => (row.pricePerMeter === null ? unknown : formatMoney(row.pricePerMeter)),
        },
        {
          label: 'Сума',
          numeric: true,
          cell: (row) => (row.value === null ? '—' : formatMoney(row.value)),
        },
      ]}
    />
  );
}

/** «Залишки»: the stock at the end of the period; a balance below zero is marked. */
export function ReportStockTable({ rows }: { rows: ReportStockRow[] }) {
  return (
    <ReportTable
      label="Залишки на кінець періоду"
      empty="На кінець періоду тканин на складі немає."
      rows={rows}
      rowKey={(row) => row.stockId}
      columns={[
        { label: 'Тканина', cell: (row) => `${row.fabricName} (${row.fabricCode})` },
        { label: 'Колір', cell: (row) => row.color },
        {
          label: 'Залишок',
          numeric: true,
          cell: (row) => (
            <Typography
              component="span"
              variant="body2"
              color={row.meters < 0 ? 'error.main' : undefined}
            >
              {formatMeters(row.meters)}
            </Typography>
          ),
        },
        {
          label: 'Ціна за м',
          numeric: true,
          cell: (row) => (row.pricePerMeter === null ? unknown : formatMoney(row.pricePerMeter)),
        },
        {
          label: 'Вартість',
          numeric: true,
          cell: (row) => (row.value === null ? '—' : formatMoney(row.value)),
        },
      ]}
    />
  );
}
