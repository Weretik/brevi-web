import { Box, Collapse, TableCell, TableRow } from '@mui/material';

import type { ReactNode } from 'react';

/** Number of columns in «Рахунки на закупку». */
export const purchaseInvoiceColumns = 8;

/** The row under an invoice that opens with its arrow: what the AI read, the originals and the buttons. */
export function PurchaseInvoiceDetailsRow({
  open,
  children,
}: {
  open: boolean;
  children: ReactNode;
}) {
  return (
    <TableRow>
      <TableCell
        colSpan={purchaseInvoiceColumns}
        sx={{ p: 0, borderBottom: open ? 1 : 0, borderColor: 'divider' }}
      >
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ bgcolor: 'action.hover' }}>
            {/* Stays in view while the table scrolls sideways and keeps a readable width. */}
            <Box
              sx={{
                position: 'sticky',
                left: 0,
                maxWidth: 880,
                px: { xs: 1.5, sm: 2 },
                pb: 2,
                pt: 0.5,
                pl: { sm: 7 },
              }}
            >
              {children}
            </Box>
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  );
}
