import { Stack, Typography } from '@mui/material';

import type { ReactNode } from 'react';

interface Props {
  subtitle: ReactNode;
  actions?: ReactNode;
}

/** Secondary line and actions of a tab on «Персонал цеху», in place of the page header of a stand-alone page. */
export function WorkshopTabHeader({ subtitle, actions }: Props) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      sx={{ justifyContent: 'space-between', alignItems: { md: 'center' }, gap: 1.5, mb: 2 }}
    >
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
      {actions && (
        <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          {actions}
        </Stack>
      )}
    </Stack>
  );
}
