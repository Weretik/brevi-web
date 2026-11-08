import { bankStatementPeriod } from '@admin/accounting/model';
import { Box, Link, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

import { FinanceProblemPill } from '../../components/status/finance-problem-pill';

import type { BankStatement } from '@admin/accounting/model';
import type { GridColDef } from '@mui/x-data-grid';

interface Props {
  rows: BankStatement[];
  loading: boolean;
  unavailable: boolean;
  onOpen: (statement: BankStatement) => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };
const twoLines = { py: 0.5, lineHeight: 1.3, minWidth: 0 } as const;
const clipped = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } as const;

const uploaded = (moment: string) =>
  new Date(moment).toLocaleString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

/** «Історія виписок»: the last uploads of every account; a click opens the statement. */
export function BankStatementsGrid({ rows, loading, unavailable, onOpen }: Props) {
  const theme = useTheme();
  const columns: GridColDef<BankStatement>[] = [
    {
      field: 'fileName',
      headerName: 'Файл',
      flex: 1,
      minWidth: 240,
      sortable: false,
      renderCell: ({ row }) => (
        <Stack sx={twoLines}>
          <Link
            component="button"
            type="button"
            underline="hover"
            onClick={() => onOpen(row)}
            sx={{ fontWeight: 600, textAlign: 'left', ...clipped }}
          >
            {row.fileName}
          </Link>
          <Typography variant="caption" color="text.secondary" sx={clipped}>
            {row.accountName}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'period',
      headerName: 'Період',
      width: 200,
      sortable: false,
      renderCell: ({ row }) => (
        <Box component="span" sx={mono}>
          {bankStatementPeriod(row)}
        </Box>
      ),
    },
    {
      field: 'lineCount',
      headerName: 'Рядків',
      width: 90,
      align: 'right',
      headerAlign: 'right',
      sortable: false,
      cellClassName: 'reference-mono',
    },
    {
      field: 'status',
      headerName: 'Проведено',
      width: 220,
      sortable: false,
      renderCell: ({ row }) =>
        row.status === 'Booked' ? (
          <Box component="span" sx={mono}>
            {row.transactionCount} опер. · {row.transferCount} перек.
          </Box>
        ) : (
          <FinanceProblemPill label="Не проведено" />
        ),
    },
    {
      field: 'createdAt',
      headerName: 'Завантажено',
      width: 170,
      sortable: false,
      renderCell: ({ row }) => (
        <Box component="span" sx={mono}>
          {uploaded(row.createdAt)}
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%', minWidth: 0, height: 'var(--admin-table-height)' }}>
      <DataGrid
        aria-label="Історія виписок"
        rows={rows}
        columns={columns}
        loading={loading}
        rowHeight={52}
        columnHeaderHeight={44}
        disableRowSelectionOnClick
        disableColumnMenu
        pageSizeOptions={[10, 25, 50, 100]}
        initialState={{ pagination: { paginationModel: { pageSize: 25, page: 0 } } }}
        localeText={{
          ...theme.components?.MuiDataGrid?.defaultProps?.localeText,
          noRowsLabel: unavailable
            ? 'Список недоступний. Повторіть запит.'
            : 'Виписок поки немає. Завантажте першу.',
        }}
        sx={{
          border: 0,
          borderTop: 1,
          borderColor: 'divider',
          borderRadius: 0,
          '& .reference-mono': mono,
        }}
      />
    </Box>
  );
}
