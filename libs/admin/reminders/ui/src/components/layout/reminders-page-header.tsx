import { Stack, Typography } from '@mui/material';

import type { ReactNode } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

/** Dense page header: one h1, a secondary line, actions on the right. */
export function RemindersPageHeader({ title, subtitle, actions }: Props) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ justifyContent: 'space-between', alignItems: { sm: 'flex-end' }, gap: 2 }}
    >
      <div>
        <Typography component="h1" variant="h4">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </div>
      {actions && (
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {actions}
        </Stack>
      )}
    </Stack>
  );
}
