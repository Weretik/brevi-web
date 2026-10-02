import { Box, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import type { AdditionalReference } from '@admin/references/model';
import type { GridColDef } from '@mui/x-data-grid';

interface Props {
  rows: AdditionalReference[];
  loading: boolean;
  onEdit: (reference: AdditionalReference) => void;
}

export function AdditionalReferencesGrid({ rows, loading, onEdit }: Props) {
  const columns: GridColDef<AdditionalReference>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Назва', flex: 1, minWidth: 180 },
    { field: 'key', headerName: 'Ключ', flex: 1, minWidth: 130 },
    {
      field: 'value',
      headerName: 'Значення',
      minWidth: 150,
      flex: 1,
      renderCell: ({ row }) =>
        `${new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 2 }).format(row.value)} ${row.unit}`,
    },
    {
      field: 'actions',
      headerName: 'Дії',
      width: 130,
      sortable: false,
      renderCell: ({ row }) => (
        <Button size="small" onClick={() => onEdit(row)}>
          Редагувати
        </Button>
      ),
    },
  ];
  return (
    <Box sx={{ width: '100%', minHeight: 440 }}>
      <DataGrid
        aria-label="Додаткові довідники"
        rows={rows}
        columns={columns}
        columnBufferPx={1000}
        loading={loading}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
        localeText={{ noRowsLabel: 'Додаткових довідників поки немає' }}
      />
    </Box>
  );
}
