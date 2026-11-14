import { formatMeters, formatMoney } from '@admin/production/model';
import { Typography } from '@mui/material';

import { unknownPrice } from './report-cells';
import { ReportTable } from './report-table';

import type { ReportStockRow } from '@admin/production/model';

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
          cell: (row) =>
            row.pricePerMeter === null ? unknownPrice : formatMoney(row.pricePerMeter),
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
