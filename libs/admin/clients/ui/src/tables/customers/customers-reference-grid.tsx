import { ReferenceStatusPill } from '@admin/references/ui';
import { Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

import type { CustomerPage, CustomerSummary } from '@admin/clients/model';
import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid';

interface Props {
  page: CustomerPage | undefined;
  loading: boolean;
  searching: boolean;
  unavailable: boolean;
  onPageChange: (model: GridPaginationModel) => void;
  onOpen: (customerId: string) => void;
}

const columns: GridColDef<CustomerSummary>[] = [
  {
    field: 'displayName',
    headerName: 'Назва',
    flex: 1.5,
    minWidth: 240,
    sortable: false,
    renderCell: ({ row }) => (
      <Stack sx={{ justifyContent: 'center', height: '100%', minWidth: 0 }}>
        <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
          {row.displayName}
        </Typography>
        {row.keepinCrmId && (
          <Typography
            variant="caption"
            color="text.secondary"
            noWrap
            sx={{ fontFamily: 'var(--admin-font-mono)', lineHeight: 1.2 }}
          >
            KeepinCRM {row.keepinCrmId}
          </Typography>
        )}
      </Stack>
    ),
  },
  {
    field: 'kind',
    headerName: 'Тип',
    width: 130,
    sortable: false,
    valueFormatter: (value: CustomerSummary['kind']) =>
      value === 'organization' ? 'Компанія' : 'Фізична особа',
  },
  {
    field: 'contactName',
    headerName: 'Контактна особа',
    flex: 1,
    minWidth: 170,
    sortable: false,
    valueFormatter: (value: string | null) => value || '—',
  },
  {
    field: 'phones',
    headerName: 'Телефон',
    width: 200,
    sortable: false,
    cellClassName: 'reference-mono',
    valueFormatter: (value: readonly string[]) => (value.length ? value.join(', ') : '—'),
  },
  {
    field: 'active',
    headerName: 'Стан',
    width: 170,
    sortable: false,
    renderCell: ({ row }) => (
      <ReferenceStatusPill
        active={row.active}
        activeLabel="Активний"
        inactiveLabel="Не використовується"
      />
    ),
  },
];

/** «Клієнти» tab of «Контрагенти»: a server-paged «Цех» table; a row opens the client card. */
export function CustomersReferenceGrid({
  page,
  loading,
  searching,
  unavailable,
  onPageChange,
  onOpen,
}: Props) {
  const theme = useTheme();
  return (
    <DataGrid
      aria-label="Клієнти"
      rows={page?.rows ?? []}
      columns={columns}
      getRowId={(row) => row.publicId}
      loading={loading}
      rowHeight={52}
      columnHeaderHeight={44}
      autoHeight
      disableColumnMenu
      disableRowSelectionOnClick
      paginationMode="server"
      rowCount={page?.total ?? 0}
      paginationModel={{ page: (page?.page ?? 1) - 1, pageSize: page?.pageSize ?? 25 }}
      onPaginationModelChange={onPageChange}
      pageSizeOptions={[25, 50, 100]}
      onRowClick={({ row }) => onOpen(row.publicId)}
      localeText={{
        ...theme.components?.MuiDataGrid?.defaultProps?.localeText,
        noRowsLabel: unavailable
          ? 'Список недоступний. Повторіть запит.'
          : searching
            ? 'Клієнтів за цими умовами не знайдено.'
            : 'Клієнтів ще немає. Оновіть їх з KeepinCRM.',
      }}
      sx={{
        minWidth: 0,
        border: 0,
        borderTop: 1,
        borderColor: 'divider',
        borderRadius: 0,
        '& .MuiDataGrid-row': { cursor: 'pointer' },
        '& .reference-mono': {
          fontFamily: 'var(--admin-font-mono)',
          fontVariantNumeric: 'tabular-nums',
        },
        '& .MuiDataGrid-columnHeaders': { bgcolor: 'action.hover' },
      }}
    />
  );
}
