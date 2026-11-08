import { auditActionLabels, auditEntityLabels } from '@admin/accounting/model';
import { Box, Link, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

import type { FinanceAuditEntry } from '@admin/accounting/model';
import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid';

interface Props {
  rows: FinanceAuditEntry[];
  rowCount: number;
  loading: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  onOpen: (entry: FinanceAuditEntry) => void;
  emptyLabel: string;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };
const clipped = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } as const;

/** When a change was made, in Kyiv: «08.11.2026, 18:06». */
export const formatAuditMoment = (moment: string) =>
  new Date(moment).toLocaleString('uk-UA', {
    timeZone: 'Europe/Kyiv',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

/** «Журнал змін»: who changed which record and how; a click opens what changed. */
export function FinanceAuditGrid({
  rows,
  rowCount,
  loading,
  paginationModel,
  onPaginationModelChange,
  onOpen,
  emptyLabel,
}: Props) {
  const theme = useTheme();
  const columns: GridColDef<FinanceAuditEntry>[] = [
    {
      field: 'at',
      headerName: 'Коли',
      width: 160,
      sortable: false,
      renderCell: ({ row }) => (
        <Box component="span" sx={mono}>
          {formatAuditMoment(row.at)}
        </Box>
      ),
    },
    {
      field: 'title',
      headerName: 'Запис',
      flex: 1,
      minWidth: 260,
      sortable: false,
      renderCell: ({ row }) => (
        <Stack sx={{ py: 0.5, lineHeight: 1.3, minWidth: 0 }}>
          <Link
            component="button"
            type="button"
            underline="hover"
            onClick={() => onOpen(row)}
            sx={{ fontWeight: 600, textAlign: 'left', ...clipped }}
          >
            {row.title || auditEntityLabels[row.entity]}
          </Link>
          <Typography variant="caption" color="text.secondary" sx={clipped}>
            {auditEntityLabels[row.entity]}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'action',
      headerName: 'Дія',
      width: 230,
      sortable: false,
      valueGetter: (value: FinanceAuditEntry['action']) => auditActionLabels[value],
    },
    { field: 'by', headerName: 'Хто', width: 230, sortable: false },
  ];

  return (
    <Box sx={{ width: '100%', minWidth: 0, height: 'var(--admin-table-height)' }}>
      <DataGrid
        aria-label="Журнал змін"
        rows={rows}
        columns={columns}
        rowCount={rowCount}
        loading={loading}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={[paginationModel.pageSize]}
        rowHeight={52}
        columnHeaderHeight={44}
        disableRowSelectionOnClick
        disableColumnMenu
        localeText={{
          ...theme.components?.MuiDataGrid?.defaultProps?.localeText,
          noRowsLabel: emptyLabel,
        }}
        sx={{ border: 0, borderTop: 1, borderColor: 'divider', borderRadius: 0 }}
      />
    </Box>
  );
}
