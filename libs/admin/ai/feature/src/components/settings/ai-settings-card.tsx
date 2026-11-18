import { Alert, Paper, Stack, Typography } from '@mui/material';

import type { AiNotice } from '../../hooks/use-ai-settings';
import type { ReactNode } from 'react';

/** A card of «Налаштування ШІ»: title, an optional action, the fields and the card's own result. */
export function Card({
  title,
  action,
  notice,
  children,
}: {
  title: string;
  action?: ReactNode;
  notice?: AiNotice;
  children: ReactNode;
}) {
  return (
    <Paper component="section" variant="outlined" sx={{ p: 2, minWidth: 0 }} aria-label={title}>
      <Stack sx={{ gap: 1.5 }}>
        <Stack
          direction="row"
          sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 1 }}
        >
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
          {action}
        </Stack>
        {children}
        {notice && <Alert severity={notice.ok ? 'success' : 'error'}>{notice.text}</Alert>}
      </Stack>
    </Paper>
  );
}
