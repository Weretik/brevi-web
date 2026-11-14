import { Card, CardContent, Typography } from '@mui/material';

import type { ReactNode } from 'react';

/** An outlined card with a small heading, used by the profile page. */
export function ProfileSection({ children, title }: { title: string; children: ReactNode }) {
  return (
    <Card variant="outlined">
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}>
        <Typography component="h2" variant="h6">
          {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
}
