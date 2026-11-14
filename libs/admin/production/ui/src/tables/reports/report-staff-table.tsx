import { formatMoney } from '@admin/production/model';
import { Typography } from '@mui/material';

import { hoursCell } from './report-cells';
import { ReportTable } from './report-table';

import type { ReportStaffRow } from '@admin/production/model';

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
        { label: 'Години', numeric: true, cell: (row) => hoursCell(row.minutes) },
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
