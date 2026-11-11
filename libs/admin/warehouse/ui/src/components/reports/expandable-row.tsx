import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, Collapse, IconButton, TableCell, TableRow } from '@mui/material';
import { useState } from 'react';

import type { ReactNode } from 'react';

interface Props {
  /** What the button says to a screen reader: «Розгорнути: …». */
  label: string;
  /** Cells after the button. */
  cells: ReactNode;
  /** Columns of the table, the button included. */
  columns: number;
  children: ReactNode;
  defaultOpen?: boolean;
}

/** A report row that opens its details («Замовлення і тканини», items of a pair, shares by order). */
export function ExpandableRow({ label, cells, columns, children, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <>
      <TableRow
        sx={{ verticalAlign: 'top', '& > td': { borderBottom: open ? 'none' : undefined } }}
      >
        <TableCell sx={{ width: 40, px: 0.5 }}>
          <IconButton
            size="small"
            aria-expanded={open}
            aria-label={`${open ? 'Згорнути' : 'Розгорнути'}: ${label}`}
            onClick={() => setOpen((x) => !x)}
          >
            {open ? (
              <KeyboardArrowDownIcon fontSize="small" />
            ) : (
              <KeyboardArrowRightIcon fontSize="small" />
            )}
          </IconButton>
        </TableCell>
        {cells}
      </TableRow>
      <TableRow>
        <TableCell colSpan={columns} sx={{ py: 0, ...(open ? {} : { borderBottom: 'none' }) }}>
          <Collapse in={open} unmountOnExit>
            <Box sx={{ py: 1.5, pl: { xs: 0, sm: 5 } }}>{children}</Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export const reportMono = {
  fontFamily: 'var(--admin-font-mono)',
  fontVariantNumeric: 'tabular-nums',
};
