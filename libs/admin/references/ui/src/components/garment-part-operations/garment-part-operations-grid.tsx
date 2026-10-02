import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { useReferenceRowContextMenu } from '../../hooks/reference-row-actions/use-reference-row-context-menu';
import { ReferenceRowContextMenu } from '../reference-row-actions/reference-row-context-menu';

import type { GarmentPartOperation } from '@admin/references/model';
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

function GarmentPartOperationsEmptyOverlay() {
  return (
    <Box sx={{ display: 'grid', height: '100%', placeItems: 'center' }}>
      <Typography>Робіт поки немає</Typography>
    </Box>
  );
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
  const { rowMenu, closeRowMenu, rowSlotProps } = useReferenceRowContextMenu(rows);
  const columns: GridColDef<GarmentPartOperation>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'garmentPartName', headerName: 'Елемент', flex: 1, minWidth: 150 },
    { field: 'name', headerName: 'Назва', flex: 1, minWidth: 180 },
    { field: 'min', headerName: 'Хвилини (Min)', width: 140, type: 'number' },
  ];

  return (
    <>
      <Box sx={{ width: '100%', minHeight: 440 }}>
        <DataGrid
          aria-label="Операції (роботи)"
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
          slots={{ noRowsOverlay: GarmentPartOperationsEmptyOverlay }}
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
