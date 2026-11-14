import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

import { bankLineMono as mono, bankLinesColumns } from './columns/bank-lines-columns';

import type { BankStatementLine } from '@admin/accounting/model';
import type { GridPaginationModel } from '@mui/x-data-grid';

interface Props {
  rows: BankStatementLine[];
  rowCount: number;
  loading: boolean;
  /** A booked statement shows its lines read-only. */
  readOnly: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  onOpen: (line: BankStatementLine) => void;
  /** «Проводити» right in the table; off for errors and records already in the books. */
  onToggle: (line: BankStatementLine, book: boolean) => void;
  /** Lines being saved: their switch waits. */
  savingIds: ReadonlySet<string>;
  emptyLabel: string;
}
/** Lines of one statement, 100 per page from the server; a click or the pencil opens the panel. */
export function BankLinesGrid({
  rows,
  rowCount,
  loading,
  readOnly,
  paginationModel,
  onPaginationModelChange,
  onOpen,
  onToggle,
  savingIds,
  emptyLabel,
}: Props) {
  const theme = useTheme();
  const columns = bankLinesColumns({ readOnly, savingIds, onToggle, onOpen });

  return (
    <Box sx={{ width: '100%', minWidth: 0, height: 'var(--admin-table-height)' }}>
      <DataGrid
        aria-label="Рядки виписки"
        rows={rows}
        columns={columns.map((column) => ({
          ...column,
          sortable: false,
          disableColumnMenu: true,
        }))}
        loading={loading}
        getRowHeight={() => 'auto'}
        columnHeaderHeight={44}
        disableRowSelectionOnClick
        onRowClick={({ row }) => onOpen(row)}
        paginationMode="server"
        rowCount={rowCount}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={[paginationModel.pageSize]}
        localeText={{
          ...theme.components?.MuiDataGrid?.defaultProps?.localeText,
          noRowsLabel: emptyLabel,
        }}
        sx={{
          border: 0,
          borderTop: 1,
          borderColor: 'divider',
          borderRadius: 0,
          '& .MuiDataGrid-row': { cursor: 'pointer' },
          '& .MuiDataGrid-cell': { display: 'flex', alignItems: 'center', minHeight: 52 },
          '& .reference-mono': mono,
        }}
      />
    </Box>
  );
}
