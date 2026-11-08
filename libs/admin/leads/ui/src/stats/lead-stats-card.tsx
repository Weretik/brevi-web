import { Box, Paper, Typography } from '@mui/material';

import type { ReactNode } from 'react';

/** «Цех» card with an uppercase title row, as on the concept. */
export function LeadStatsCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Paper variant="outlined" component="section" sx={{ overflow: 'hidden', minWidth: 0 }}>
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography
          component="h2"
          sx={{ fontSize: 13, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}
        >
          {title}
        </Typography>
        {action}
      </Box>
      {children}
    </Paper>
  );
}
