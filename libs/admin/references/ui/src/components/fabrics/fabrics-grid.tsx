import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { useReferenceRowContextMenu } from '../../hooks/reference-row-actions/use-reference-row-context-menu';
import { ReferenceRowContextMenu } from '../reference-row-actions/reference-row-context-menu';

import type { Fabric } from '@admin/references/model';
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

function FabricsEmptyOverlay() {
  return (
    <Box sx={{ display: 'grid', height: '100%', placeItems: 'center' }}>
      <Typography>Тканин поки немає</Typography>
    </Box>
  );
}

export function FabricsGrid({
  rows,
  loading,
  selection,
  onSelectionChange,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const { rowMenu, closeRowMenu, rowSlotProps } = useReferenceRowContextMenu(rows);
  const columns: GridColDef<Fabric>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Назва', flex: 1, minWidth: 180 },
    { field: 'providerName', headerName: 'Постачальник', flex: 1, minWidth: 160 },
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
          aria-label="Тканини"
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
          slots={{ noRowsOverlay: FabricsEmptyOverlay }}
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
