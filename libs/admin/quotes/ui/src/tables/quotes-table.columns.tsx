import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { IconButton, Tooltip } from '@mui/material';

import { QuoteStatusPill } from '../components/editor/cards/quote-status-pill';

import type { QuoteSummary } from '@admin/quotes/model';
import type { GridColDef } from '@mui/x-data-grid';

const dateFormat = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'short', timeStyle: 'short' });

export const statusColumn: GridColDef<QuoteSummary> = {
  field: 'status',
  headerName: 'Стан',
  width: 170,
  renderCell: ({ row }) => <QuoteStatusPill status={row.status} lastSentAt={row.lastSentAt} />,
};

export const deleteColumn = (onDelete: (row: QuoteSummary) => void): GridColDef<QuoteSummary> => ({
  field: 'actions',
  headerName: '',
  width: 64,
  sortable: false,
  align: 'center',
  renderCell: ({ row }) => (
    <Tooltip title="Видалити КП">
      <IconButton
        size="small"
        aria-label={`Видалити КП ${row.number}`}
        onClick={(event) => {
          event.stopPropagation();
          onDelete(row);
        }}
      >
        <DeleteOutlineOutlinedIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  ),
});

export const columns: GridColDef<QuoteSummary>[] = [
  { field: 'number', headerName: 'Номер', width: 120, cellClassName: 'quote-mono' },
  { field: 'internalName', headerName: 'Клієнт / запит', flex: 1.4, minWidth: 200 },
  {
    field: 'kind',
    headerName: 'Вид',
    width: 130,
    valueGetter: (_value, row) => (row.kind === 'Introduction' ? 'Для знайомства' : 'Під запит'),
  },
  {
    field: 'companyName',
    headerName: 'Підприємство',
    flex: 1,
    minWidth: 160,
    valueGetter: (_value, row) => row.companyName ?? '',
  },
  {
    field: 'responsible',
    headerName: 'Відповідальний',
    flex: 0.8,
    minWidth: 150,
    valueGetter: (_value, row) => row.responsible.name,
  },
  {
    field: 'itemsCount',
    headerName: 'Позицій',
    width: 100,
    align: 'right',
    headerAlign: 'right',
    cellClassName: 'quote-mono',
  },
  {
    field: 'updatedAt',
    headerName: 'Змінено',
    width: 150,
    cellClassName: 'quote-mono',
    valueFormatter: (value: string) => dateFormat.format(new Date(value)),
  },
];
