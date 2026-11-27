import { Card, Link, Stack, Typography } from '@mui/material';

import type { ReactNode } from 'react';

interface Props {
  title: string;
  /** «Усі →»: opens the tab with the full list. */
  onOpenAll?: () => void;
  children: ReactNode;
}

/** A data card of a card's «Огляд»: an `h6` title, an optional «Усі →» link, then the content. */
export function CardSection({ title, onOpenAll, children }: Props) {
  return (
    <Card variant="outlined" sx={{ p: 2, minWidth: 0 }}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
        {onOpenAll && (
          <Link
            component="button"
            type="button"
            underline="hover"
            onClick={onOpenAll}
            sx={{ color: 'primary.dark', typography: 'body2', fontWeight: 600 }}
          >
            Усі →
          </Link>
        )}
      </Stack>
      {children}
    </Card>
  );
}
