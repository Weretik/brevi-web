import { Paper, TableContainer, Typography } from '@mui/material';

import type { ReactNode } from 'react';

export const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };
export const count = (value: number) => value.toLocaleString('uk-UA');

/** One titled table block of the archive move report. */
export function LegacyImportSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <Paper component="section" variant="outlined" aria-labelledby={id} sx={{ overflow: 'hidden' }}>
      <Typography
        id={id}
        variant="h6"
        component="h2"
        sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}
      >
        {title}
      </Typography>
      <TableContainer>{children}</TableContainer>
    </Paper>
  );
}
