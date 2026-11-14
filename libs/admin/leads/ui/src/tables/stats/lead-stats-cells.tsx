import { Typography } from '@mui/material';

import { mono } from '../../components/mono';

export const num = { ...mono, textAlign: 'right' } as const;

export function LeadStatsEmpty({ text }: { text: string }) {
  return (
    <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 1.5 }}>
      {text}
    </Typography>
  );
}
