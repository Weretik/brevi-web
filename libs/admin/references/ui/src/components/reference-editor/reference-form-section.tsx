import { Paper, Stack, Typography } from '@mui/material';

import type { ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
}

/** Outlined card with a «Цех» card title for editor and details sections. */
export function ReferenceFormSection({ title, children }: Props) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography component="h3" variant="h6" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Stack sx={{ gap: 2 }}>{children}</Stack>
    </Paper>
  );
}
