import { Box } from '@mui/material';

import type { StatusTone } from '../../model/dashboard-view';

interface QuoteStatusPillProps {
  label: string;
  tone: StatusTone;
}

export function QuoteStatusPill({ label, tone }: QuoteStatusPillProps) {
  return (
    <Box
      component="span"
      sx={{
        alignItems: 'center',
        bgcolor: `${tone}.light`,
        borderRadius: 999,
        color: `${tone}.main`,
        display: 'inline-flex',
        fontSize: 12,
        fontWeight: 700,
        gap: 0.75,
        height: 24,
        px: 1.25,
        whiteSpace: 'nowrap',
        '&::before': {
          bgcolor: 'currentColor',
          borderRadius: '50%',
          content: '""',
          height: 6,
          width: 6,
        },
      }}
    >
      {label}
    </Box>
  );
}
