import { Box, Button, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import type { Fabric } from '@admin/references/data-access';
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';

interface Props {
  rows: Fabric[];
  loading: boolean;
  selection: GridRowSelectionModel;
  onSelectionChange: (selection: GridRowSelectionModel) => void;
  onView: (fabric: Fabric) => void;
  onEdit: (fabric: Fabric) => void;
  onDelete: (id: number) => void;
}

export function FabricsGrid({ rows, loading, selection, onSelectionChange, onView, onEdit, onDelete }: Props) {
  const columns: GridColDef<Fabric>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Назва', flex: 1, minWidth: 180 },
    { field: 'providerName', headerName: 'Постачальник', flex: 1, minWidth: 160 },
    { field: 'price', headerName: 'Ціна', width: 140, valueFormatter: (value: number) => `${new Intl.NumberFormat('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)} грн` },
    { field: 'actions', headerName: 'Дії', width: 245, sortable: false, renderCell: ({ row }) => (
      <Stack direction="row">
        <Button size="small" onClick={() => onView(row)}>Перегляд</Button>
        <Button size="small" onClick={() => onEdit(row)}>Змінити</Button>
        <Button size="small" color="error" onClick={() => onDelete(row.id)}>Видалити</Button>
      </Stack>
    ) },
  ];

  return <Box sx={{ width: '100%', minHeight: 440 }}>
    <DataGrid
      aria-label="Тканини"
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
      localeText={{ noRowsLabel: 'Тканин поки немає' }}
    />
  </Box>;
}
