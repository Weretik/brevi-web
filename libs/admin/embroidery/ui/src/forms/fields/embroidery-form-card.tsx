import { Paper, Stack, Typography } from '@mui/material';

import type { ReactNode } from 'react';

interface Props {
  /** «1 · Що вишиваємо». */
  title: string;
  /** Right side of the header: a sum or a counter. */
  aside?: ReactNode;
  /** Anchor for «Виправте: …» links. */
  id?: string;
  children: ReactNode;
}

/** An outlined card with a «Цех» card title for one step of a form. */
export function EmbroideryFormCard({ title, aside, id, children }: Props) {
  return (
    <Paper
      variant="outlined"
      component="section"
      id={id}
      aria-label={title}
      sx={{ p: 2, scrollMarginTop: 88 }}
    >
      <Stack
        direction="row"
        sx={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 2, mb: 2 }}
      >
        <Typography component="h2" variant="h6">
          {title}
        </Typography>
        {aside}
      </Stack>
      <Stack sx={{ gap: 2 }}>{children}</Stack>
    </Paper>
  );
}
