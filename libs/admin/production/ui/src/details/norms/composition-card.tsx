import { Box, Paper, TableContainer, Typography } from '@mui/material';

import type { ReactNode } from 'react';

/** A titled outlined card around one composition table of the model work card. */
export function CompositionCard({
  title,
  action,
  children,
}: {
  title: string;
  action: ReactNode;
  children: ReactNode;
}) {
  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden', minWidth: 0 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1.25,
        }}
      >
        <Typography variant="h6" component="h3">
          {title}
        </Typography>
        {action}
      </Box>
      <TableContainer>{children}</TableContainer>
    </Paper>
  );
}
