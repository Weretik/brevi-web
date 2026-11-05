import { Link, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

import type { PurchaseInvoice, PurchaseInvoicePage } from '@admin/purchasing/model';
import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import type {} from '@mui/x-data-grid/themeAugmentation';

interface Props {
  page: PurchaseInvoicePage | undefined;
  loading: boolean;
  /** Search or a filter is on: an empty page means «nothing found», not «empty register». */
  narrowed: boolean;
  unavailable: boolean;
  onPageChange: (model: GridPaginationModel) => void;
  /** A row opens the card in the side panel. */
  onOpen: (invoice: PurchaseInvoice) => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };
const clamp = (lines: number) => ({
  display: '-webkit-box',
  WebkitLineClamp: lines,
  WebkitBoxOrient: 'vertical' as const,
  overflow: 'hidden',
});

const cell = { justifyContent: 'center', height: '100%', minWidth: 0, py: 1 };

const columns: GridColDef<PurchaseInvoice>[] = [
  {
    field: 'messageAt',
    headerName: 'Дата',
    width: 170,
    sortable: false,
    renderCell: ({ row }) => (
      <Stack sx={cell}>
        <Typography variant="body2" noWrap sx={mono}>
          {row.messageAt || '—'}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap sx={mono}>
          UID {row.sourceUid}
        </Typography>
      </Stack>
    ),
  },
  {
    field: 'text',
    headerName: 'Повідомлення',
    flex: 1.6,
    minWidth: 280,
    sortable: false,
    renderCell: ({ row }) => (
      <Stack sx={cell}>
        <Typography variant="body2" sx={clamp(2)} title={row.text}>
          {row.text || '—'}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {[row.chatName, row.fromUser].filter(Boolean).join(' · ') || '—'}
        </Typography>
      </Stack>
    ),
  },
  {
    field: 'links',
    headerName: 'Оригінали',
    width: 210,
    sortable: false,
    renderCell: ({ row }) => (
      <Stack sx={{ ...cell, gap: 0.25 }}>
        {row.links.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            —
          </Typography>
        ) : (
          row.links.slice(0, 2).map((link, index) =>
            link.safe ? (
              <Link
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                variant="body2"
                onClick={(event) => event.stopPropagation()}
                noWrap
              >
                Оригінал{row.links.length > 1 ? ` ${index + 1}` : ''} ↗
              </Link>
            ) : (
              <Typography
                key={link.id}
                variant="body2"
                color="warning.main"
                noWrap
                title={link.url}
              >
                Посилання потребує перевірки
              </Typography>
            ),
          )
        )}
        {row.links.length > 2 && (
          <Typography variant="caption" color="text.secondary">
            ще {row.links.length - 2}
          </Typography>
        )}
      </Stack>
    ),
  },
  {
    field: 'supplierName',
    headerName: 'Постачальник',
    flex: 0.9,
    minWidth: 190,
    sortable: false,
    renderCell: ({ row }) => (
      <Stack sx={cell}>
        {row.supplierId !== null && row.supplierName === null ? (
          <Typography variant="body2" color="warning.main" noWrap>
            Постачальника не знайдено
          </Typography>
        ) : (
          <Typography
            variant="body2"
            noWrap
            color={row.supplierName ? 'text.primary' : 'text.secondary'}
          >
            {row.supplierName ?? '—'}
          </Typography>
        )}
        {row.reviewNote && (
          <Typography variant="caption" color="text.secondary" noWrap title={row.reviewNote}>
            {row.reviewNote}
          </Typography>
        )}
      </Stack>
    ),
  },
  {
    field: 'markedPaid',
    headerName: 'Оплата',
    width: 190,
    sortable: false,
    renderCell: ({ row }) => (
      <Stack sx={cell}>
        <Typography variant="body2" noWrap>
          {row.markedPaid ? 'Відмічено в джерелі' : 'Не підтверджено'}
        </Typography>
        {row.markedPaid && (row.markBy || row.markAt) && (
          <Typography variant="caption" color="text.secondary" noWrap>
            {[row.markBy, row.markAt].filter(Boolean).join(' · ')}
          </Typography>
        )}
      </Stack>
    ),
  },
  {
    field: 'issues',
    headerName: 'Проблеми',
    flex: 1,
    minWidth: 220,
    sortable: false,
    renderCell: ({ row }) =>
      row.issues.length > 0 ? (
        <Stack sx={cell}>
          <Typography
            variant="body2"
            color="warning.main"
            sx={clamp(2)}
            title={row.issues.join('\n')}
          >
            {row.issues.join('; ')}
          </Typography>
        </Stack>
      ) : null,
  },
];

/**
 * «Рахунки на закупку»: one row per Telegram message of the sheet «финансы». Only problems are
 * marked; «СПЛАЧЕНО» in the sheet is shown as a source mark, not as a payment.
 */
export function PurchaseInvoicesTable({
  page,
  loading,
  narrowed,
  unavailable,
  onPageChange,
  onOpen,
}: Props) {
  const theme = useTheme();
  return (
    <DataGrid
      aria-label="Рахунки на закупку"
      rows={page?.items ?? []}
      columns={columns}
      getRowId={(row) => row.messageId}
      loading={loading}
      rowHeight={64}
      columnHeaderHeight={44}
      disableColumnMenu
      disableRowSelectionOnClick
      paginationMode="server"
      rowCount={page?.total ?? 0}
      paginationModel={{ page: (page?.page ?? 1) - 1, pageSize: page?.pageSize ?? 50 }}
      onPaginationModelChange={onPageChange}
      onRowClick={({ row }) => onOpen(row)}
      pageSizeOptions={[25, 50, 100]}
      localeText={{
        ...theme.components?.MuiDataGrid?.defaultProps?.localeText,
        noRowsLabel: unavailable
          ? 'Реєстр недоступний. Повторіть запит.'
          : narrowed
            ? 'Рахунків за цими умовами не знайдено.'
            : 'Реєстр порожній. Натисніть «Оновити зараз».',
      }}
      sx={{
        minWidth: 0,
        height: 'var(--admin-table-height)',
        border: 0,
        borderTop: 1,
        borderColor: 'divider',
        borderRadius: 0,
        '& .MuiDataGrid-row': { cursor: 'pointer' },
        '& .MuiDataGrid-columnHeaders': { bgcolor: 'action.hover' },
        '& .MuiDataGrid-cell': { display: 'flex', alignItems: 'center' },
      }}
    />
  );
}
