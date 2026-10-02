import { Card, CardContent, Stack, Typography } from '@mui/material';

import type { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  label: string;
  title?: string;
}

export function ProductDetailSection({ children, label, title }: Props) {
  return (
    <Card
      component="section"
      aria-label={label}
      variant="outlined"
      sx={{ bgcolor: 'common.white', color: 'common.black', minWidth: 0 }}
    >
      <CardContent component={Stack} sx={{ gap: 2, '&:last-child': { pb: 2 } }}>
        {title && <Typography variant="h6">{title}</Typography>}
        {children}
      </CardContent>
    </Card>
  );
}
