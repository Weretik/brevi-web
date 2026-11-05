import { Box, Link } from '@mui/material';

import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** The fix, e.g. «Перевірити»; opens `href`. */
  actionLabel: string;
  href: string;
}

/** One warning line above the data: what needs the director and where to fix it. */
export function FinanceAttentionStrip({ children, actionLabel, href }: Props) {
  return (
    <Box
      role="status"
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        px: 2,
        py: 1.25,
        borderRadius: 2,
        bgcolor: 'warning.light',
        color: 'warning.dark',
      }}
    >
      <Box component="span">{children}</Box>
      <Link
        href={href}
        underline="hover"
        sx={{ fontWeight: 700, color: 'inherit', whiteSpace: 'nowrap' }}
      >
        {actionLabel} →
      </Link>
    </Box>
  );
}
