import { Box, Button, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import type { GarmentPartOperation } from '@admin/references/data-access';
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';

interface Props {
  rows: GarmentPartOperation[];
  loading: boolean;
  selection: GridRowSelectionModel;
  onSelectionChange: (selection: GridRowSelectionModel) => void;
  onView: (operation: GarmentPartOperation) => void;
  onEdit: (operation: GarmentPartOperation) => void;
  onDelete: (id: number) => void;
}

export function GarmentPartOperationsGrid({
  rows,
  loading,
  selection,
  onSelectionChange,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const columns: GridColDef<GarmentPartOperation>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'garmentPartName', headerName: 'Елемент', flex: 1, minWidth: 150 },
    { field: 'name', headerName: 'Назва', flex: 1, minWidth: 180 },
    { field: 'min', headerName: 'Хвилини (Min)', width: 140, type: 'number' },
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
  ];

  return (
    <Box sx={{ width: '100%', minHeight: 440 }}>
      <DataGrid
        aria-label="Операції (роботи)"
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
        localeText={{ noRowsLabel: 'Робіт поки немає' }}
      />
    </Box>
  );
}
