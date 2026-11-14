import { formatMoney } from '@admin/production/model';

import { orderCell, unknownPrice } from './report-cells';
import { ReportTable } from './report-table';

import type { ReportOutputRow } from '@admin/production/model';

/** «Випуск»: pieces sewn within the plan at the КП price. */
export function ReportOutputTable({ rows }: { rows: ReportOutputRow[] }) {
  return (
    <ReportTable
      label="Випуск за завданнями"
      empty="За період нічого не пошито."
      rows={rows}
      rowKey={(row) => row.itemId}
      columns={[
        { label: 'Завдання', cell: (row) => orderCell(row.orderId, row.orderNumber) },
        { label: 'Замовник', cell: (row) => row.clientName },
        { label: 'Модель', cell: (row) => row.modelName },
        { label: 'Пошито, шт.', numeric: true, cell: (row) => row.quantity },
        {
          label: 'Ціна КП',
          numeric: true,
          cell: (row) => (row.unitPrice === null ? unknownPrice : formatMoney(row.unitPrice)),
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
