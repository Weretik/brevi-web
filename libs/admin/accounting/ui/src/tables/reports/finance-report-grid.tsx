import { Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

import { reportMono as mono } from './columns/finance-report-cell-columns';
import { financeReportColumns } from './columns/finance-report-columns';

import type { FinanceReportGridRow as Row } from './columns/finance-report-cell-columns';
import type { FinanceReport } from '@admin/accounting/model';

interface Props {
  report: FinanceReport | null;
  loading: boolean;
  /** Text while nothing is built or the request failed. */
  emptyLabel: string;
}

/** The rows of a built report; columns follow its kind. */
export function FinanceReportGrid({ report, loading, emptyLabel }: Props) {
  const theme = useTheme();
  const rows: Row[] = (report?.rows ?? []).map((row, key) => ({ ...row, key }));
  return (
    <Stack sx={{ width: '100%', minWidth: 0, height: 'var(--admin-table-height)' }}>
      <DataGrid
        aria-label="Рядки звіту"
        rows={rows}
        getRowId={(row) => row.key}
        columns={report ? financeReportColumns(report) : []}
        loading={loading}
        rowHeight={44}
        columnHeaderHeight={44}
        disableRowSelectionOnClick
        disableColumnMenu
        pageSizeOptions={[25, 50, 100]}
        initialState={{ pagination: { paginationModel: { pageSize: 100, page: 0 } } }}
        getRowClassName={({ row }) =>
          row.rowType === 'Group' && report?.kind === 'ExpenseStructure' ? 'report-group' : ''
        }
        localeText={{
          ...theme.components?.MuiDataGrid?.defaultProps?.localeText,
          noRowsLabel: emptyLabel,
        }}
        sx={{
          border: 0,
          borderTop: 1,
          borderColor: 'divider',
          borderRadius: 0,
          '& .reference-mono': mono,
          '& .report-group': { bgcolor: 'action.hover' },
        }}
      />
    </Stack>
  );
}
