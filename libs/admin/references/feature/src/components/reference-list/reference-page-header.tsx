import { Box, Stack, Typography } from '@mui/material';

import type { ReactNode } from 'react';

interface Props {
  title: string;
  subtitle: string;
  action: ReactNode;
}

/** «Цех» page header of a reference: overline, h1, secondary line, primary action. */
export function ReferencePageHeader({ title, subtitle, action }: Props) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 2.5 }}
    >
      <Box>
        <Typography variant="overline" color="text.secondary">
          Довідники
        </Typography>
        <Typography variant="h1">{title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      </Box>
      <Box sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}>{action}</Box>
    </Stack>
  );
}
