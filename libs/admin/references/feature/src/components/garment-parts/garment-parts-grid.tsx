import { Box, Button, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import type { GarmentPart } from '@admin/references/data-access';
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';

interface Props {
  rows: GarmentPart[];
  loading: boolean;
  selection: GridRowSelectionModel;
  onSelectionChange: (selection: GridRowSelectionModel) => void;
  onView: (garmentPart: GarmentPart) => void;
  onEdit: (garmentPart: GarmentPart) => void;
  onDelete: (id: number) => void;
}

export function GarmentPartsGrid({
  rows,
  loading,
  selection,
  onSelectionChange,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const columns: GridColDef<GarmentPart>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Назва', flex: 1, minWidth: 180 },
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
        aria-label="Елементи виробу"
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
        localeText={{ noRowsLabel: 'Елементів виробу поки немає' }}
      />
    </Box>
  );
}
