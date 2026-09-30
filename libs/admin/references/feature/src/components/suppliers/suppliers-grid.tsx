import { Box, Button, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import type { Supplier } from '@admin/references/data-access';
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';

interface Props {
  rows: Supplier[];
  loading: boolean;
  selection: GridRowSelectionModel;
  onSelectionChange: (selection: GridRowSelectionModel) => void;
  onView: (supplier: Supplier) => void;
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: number) => void;
}

export function SuppliersGrid({
  rows,
  loading,
  selection,
  onSelectionChange,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const columns: GridColDef<Supplier>[] = [
    {
      field: 'actions',
      headerName: 'Дії',
      width: 245,
      sortable: false,
      renderCell: ({ row }) => (
        <Stack direction="row">
          <Button size="small" onClick={() => onView(row)}>
            Перегляд
          </Button>
          <Button size="small" onClick={() => onEdit(row)}>
            Змінити
          </Button>
          <Button size="small" color="error" onClick={() => onDelete(row.id)}>
            Видалити
          </Button>
        </Stack>
      ),
    },
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Назва', flex: 1, minWidth: 180 },
    { field: 'phoneNumber', headerName: 'Телефон', flex: 1, minWidth: 150 },
    { field: 'contactPerson', headerName: 'Контактна особа', flex: 1, minWidth: 170 },
    { field: 'notes', headerName: 'Нотатки', flex: 1, minWidth: 180 },
    { field: 'link', headerName: 'Посилання', flex: 1, minWidth: 150 },
  ];

  return (
    <Box sx={{ width: '100%', minHeight: 440 }}>
      <DataGrid
        aria-label="Постачальники"
        rows={rows}
        columns={columns}
        loading={loading}
        checkboxSelection
        disableRowSelectionExcludeModel
        keepNonExistentRowsSelected
        rowSelectionModel={selection}
        onRowSelectionModelChange={onSelectionChange}
        pageSizeOptions={[10, 25, 50]}
        initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
        localeText={{ noRowsLabel: 'Постачальників поки немає' }}
      />
    </Box>
  );
}
