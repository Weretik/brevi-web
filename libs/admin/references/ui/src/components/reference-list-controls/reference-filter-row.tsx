import { Box, Link, Stack, Typography } from '@mui/material';

import type { ReactNode } from 'react';

interface Props {
  /** Filter chips on the left. */
  filters: ReactNode;
  /** Rows left after search and filters, and rows before search narrows them. */
  count: number;
  total: number;
  /** Accessible name of the result counter, e.g. «Кількість тканин». */
  countLabel: string;
  selectedCount: number;
  onClearSelection: () => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/**
 * «Цех» filter row between the search bar and the table: chips on the left, and on the right the
 * selection («Вибрано 2 · Зняти вибір») or the number found.
 */
export function ReferenceFilterRow({
  filters,
  count,
  total,
  countLabel,
  selectedCount,
  onClearSelection,
}: Props) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ gap: 1.5, mb: 1.5, alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
    >
      <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
        {filters}
      </Stack>
      <Typography variant="body2" color="text.secondary" role="status" aria-label={countLabel}>
        {selectedCount > 0 ? (
          <>
            Вибрано:{' '}
            <Box component="span" sx={mono}>
              {selectedCount}
            </Box>{' '}
            ·{' '}
            <Link component="button" type="button" variant="body2" onClick={onClearSelection}>
              Зняти вибір
            </Link>
          </>
        ) : count !== total ? (
          <>
            Знайдено:{' '}
            <Box component="span" sx={mono}>
              {count}
            </Box>{' '}
            із{' '}
            <Box component="span" sx={mono}>
              {total}
            </Box>
          </>
        ) : null}
      </Typography>
    </Stack>
  );
}
