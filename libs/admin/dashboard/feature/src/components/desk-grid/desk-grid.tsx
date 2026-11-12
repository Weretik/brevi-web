import { Box } from '@mui/material';

import type { ReactNode } from 'react';

interface DeskGridProps {
  /** Most blocks side by side on a wide desk; 2 for the list cards, 3 for the workshop side cards. */
  columns: 2 | 3;
  children: ReactNode;
}

/** Desk width from which blocks go side by side: below it every block takes the full width, one under another. */
const twoColumnsFrom = 960;
const threeColumnsFrom = 1380;

/**
 * Blocks of a desk. Columns follow the width of the desk itself (a container query), not the window, so with the
 * menu open on a laptop or a narrow window the blocks stack and their text and buttons keep their room.
 */
export function DeskGrid({ columns, children }: DeskGridProps) {
  return (
    <Box sx={{ containerType: 'inline-size', minWidth: 0 }}>
      <Box
        sx={{
          alignItems: 'start',
          display: 'grid',
          gap: 2,
          gridTemplateColumns: 'minmax(0, 1fr)',
          [`@container (min-width: ${twoColumnsFrom}px)`]: {
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          },
          ...(columns === 3 && {
            [`@container (min-width: ${threeColumnsFrom}px)`]: {
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            },
          }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
