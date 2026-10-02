import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { useReferenceRowContextMenu } from '../../hooks/reference-row-actions/use-reference-row-context-menu';
import { ReferenceRowContextMenu } from '../reference-row-actions/reference-row-context-menu';

import type { Supplier } from '@admin/references/model';
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
  const { rowMenu, closeRowMenu, rowSlotProps } = useReferenceRowContextMenu(rows);
  const columns: GridColDef<Supplier>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Назва', flex: 1, minWidth: 180 },
    { field: 'phoneNumber', headerName: 'Телефон', flex: 1, minWidth: 150 },
    { field: 'contactPerson', headerName: 'Контактна особа', flex: 1, minWidth: 170 },
    { field: 'notes', headerName: 'Нотатки', flex: 1, minWidth: 180 },
    { field: 'link', headerName: 'Посилання', flex: 1, minWidth: 150 },
  ];

  return (
    <>
      <Box sx={{ width: '100%', minHeight: 440 }}>
        <DataGrid
          aria-label="Постачальники"
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
          slots={{ noRowsOverlay: SuppliersEmptyOverlay }}
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

function SuppliersEmptyOverlay() {
  return (
    <Box sx={{ display: 'grid', height: '100%', placeItems: 'center' }}>
      <Typography>Постачальників поки немає</Typography>
    </Box>
  );
}
