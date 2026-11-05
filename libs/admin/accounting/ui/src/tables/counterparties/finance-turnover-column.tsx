import { formatLedgerDate, formatMinor } from '@admin/accounting/model';
import { Box } from '@mui/material';

import type { GridColDef, GridValidRowModel } from '@mui/x-data-grid';

/** «Оборот з 01.10.2026»: incomes minus expenses of the current books, green or red. */
export function financeTurnoverColumn<
  Row extends GridValidRowModel & { currentTurnoverMinor: number },
>(cutoverDate: string, monoClass: string): GridColDef<Row> {
  return {
    field: 'currentTurnoverMinor',
    headerName: `Оборот з ${formatLedgerDate(cutoverDate)}`,
    width: 170,
    align: 'right',
    headerAlign: 'right',
    sortable: false,
    cellClassName: monoClass,
    renderCell: ({ row }) => {
      const value = row.currentTurnoverMinor;
      if (!value) return '—';
      return (
        <Box
          component="span"
          sx={{ fontWeight: 600, color: value > 0 ? 'success.main' : 'error.main' }}
        >
          {value > 0 ? '+' : '−'}
          {formatMinor(Math.abs(value))}
        </Box>
      );
    },
  };
}
