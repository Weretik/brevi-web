import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined';
import { Box, IconButton, Tooltip } from '@mui/material';

import type { ReferenceRow } from './reference-data-grid.props';
import type { GridColDef } from '@mui/x-data-grid';

interface Options<Row extends ReferenceRow> {
  isDetailRow?: (row: Row) => boolean;
  openHref?: (row: Row) => string;
  /** The row whose menu is open. */
  openRowId?: Row['id'];
  onOpenMenu: (row: Row, target: HTMLElement) => void;
}

/** «Дії»: «Відкрити повну картку» and «…» with the row menu; nothing on detail rows. */
export function referenceActionsColumn<Row extends ReferenceRow>({
  isDetailRow,
  openHref,
  openRowId,
  onOpenMenu,
}: Options<Row>): GridColDef<Row> {
  return {
    field: 'actions',
    headerName: 'Дії',
    width: openHref ? 104 : 64,
    align: 'center',
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: ({ row, tabIndex }) =>
      isDetailRow?.(row) ? null : (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {openHref && (
            <Tooltip title="Відкрити повну картку">
              <IconButton
                size="small"
                href={openHref(row)}
                aria-label={`Відкрити повну картку: ${row.name}`}
                tabIndex={tabIndex}
                onClick={(event) => event.stopPropagation()}
                sx={{ width: 40, height: 40 }}
              >
                <OpenInFullOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <IconButton
            size="small"
            aria-label={`Дії: ${row.name}`}
            tabIndex={tabIndex}
            aria-haspopup="menu"
            aria-expanded={openRowId === row.id ? true : undefined}
            onClick={(event) => {
              event.stopPropagation();
              onOpenMenu(row, event.currentTarget);
            }}
            sx={{ width: 40, height: 40 }}
          >
            <MoreHorizOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
  };
}
