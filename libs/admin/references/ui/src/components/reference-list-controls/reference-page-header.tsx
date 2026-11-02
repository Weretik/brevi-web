import { Box, Stack, Typography } from '@mui/material';

import type { ReactNode } from 'react';

interface Props {
  title: string;
  subtitle: ReactNode;
  /** Right side: bulk delete (only while rows are selected), secondary actions, the primary one. */
  actions: ReactNode;
}

/** «Цех» page header of a reference: overline, h1, secondary line, actions on the right. */
export function ReferencePageHeader({ title, subtitle, actions }: Props) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      sx={{ justifyContent: 'space-between', alignItems: { md: 'flex-end' }, gap: 2, mb: 2 }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="overline" color="text.secondary">
          Довідники
        </Typography>
        <Typography variant="h1">{title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      </Box>
      <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
        {actions}
      </Stack>
    </Stack>
  );
}
