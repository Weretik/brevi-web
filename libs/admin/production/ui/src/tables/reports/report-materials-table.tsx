import { formatDay, formatMeters, formatMoney } from '@admin/production/model';

import { orderCell, unknownPrice } from './report-cells';
import { ReportTable } from './report-table';

import type { ReportIssueRow } from '@admin/production/model';

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
        { label: 'Завдання', cell: (row) => orderCell(row.orderId, row.orderNumber) },
        { label: 'Модель', cell: (row) => row.modelName ?? '—' },
        { label: 'Кількість', numeric: true, cell: (row) => formatMeters(row.meters) },
        {
          label: 'Ціна за м',
          numeric: true,
          cell: (row) =>
            row.pricePerMeter === null ? unknownPrice : formatMoney(row.pricePerMeter),
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
