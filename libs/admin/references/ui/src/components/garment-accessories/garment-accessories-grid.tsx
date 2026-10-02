import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { useReferenceRowContextMenu } from '../../hooks/reference-row-actions/use-reference-row-context-menu';
import { ReferenceRowContextMenu } from '../reference-row-actions/reference-row-context-menu';

import type { GarmentAccessory } from '@admin/references/model';
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';

interface Props {
  rows: GarmentAccessory[];
  loading: boolean;
  selection: GridRowSelectionModel;
  onSelectionChange: (selection: GridRowSelectionModel) => void;
  onView: (accessory: GarmentAccessory) => void;
  onEdit: (accessory: GarmentAccessory) => void;
  onDelete: (id: number) => void;
}

function GarmentAccessoriesEmptyOverlay() {
  return (
    <Box sx={{ display: 'grid', height: '100%', placeItems: 'center' }}>
      <Typography>Фурнітури поки немає</Typography>
    </Box>
  );
}

export function GarmentAccessoriesGrid({
  rows,
  loading,
  selection,
  onSelectionChange,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const { rowMenu, closeRowMenu, rowSlotProps } = useReferenceRowContextMenu(rows);
  const columns: GridColDef<GarmentAccessory>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Назва', flex: 1, minWidth: 180 },
    { field: 'supplierName', headerName: 'Постачальник', flex: 1, minWidth: 160 },
    {
      field: 'price',
      headerName: 'Ціна',
      width: 140,
      valueFormatter: (value: number) =>
        `${new Intl.NumberFormat('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)} грн`,
    },
  ];

  return (
    <>
      <Box sx={{ width: '100%', minHeight: 440 }}>
        <DataGrid
          aria-label="Фурнітура виробу"
          rows={rows}
          columns={columns}
          loading={loading}
          checkboxSelection
          disableRowSelectionOnClick
          disableRowSelectionExcludeModel
          keepNonExistentRowsSelected
          rowSelectionModel={selection}
          onRowSelectionModelChange={onSelectionChange}
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
          slots={{ noRowsOverlay: GarmentAccessoriesEmptyOverlay }}
          slotProps={{ row: rowSlotProps }}
        />
      </Box>
      <ReferenceRowContextMenu
        anchorPosition={rowMenu?.anchorPosition ?? null}
        row={rowMenu?.row ?? null}
        rowName={rowMenu?.row.name ?? ''}
        onClose={closeRowMenu}
        onView={onView}
        onEdit={onEdit}
        onDelete={(row) => onDelete(row.id)}
      />
    </>
  );
}
