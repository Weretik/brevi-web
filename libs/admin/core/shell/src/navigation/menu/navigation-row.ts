import { getNavigationPalette } from '../navigation-palette';

import type { Theme } from '@mui/material/styles';

/** Shared look of a top-level sidebar row (home link and group buttons). */
export function navigationRowSx(theme: Theme) {
  const nav = getNavigationPalette(theme);
  return {
    borderRadius: 1.5,
    color: nav.text,
    minHeight: 42,
    overflow: 'hidden',
    px: 1.75,
    whiteSpace: 'nowrap',
    width: '100%',
    transition: theme.transitions.create(['background-color', 'color'], {
      duration: theme.transitions.duration.shortest,
    }),
    '&:hover': { bgcolor: nav.hover },
    '&.Mui-selected, &.Mui-selected:hover': {
      bgcolor: nav.activeBackground,
      color: nav.activeText,
    },
  } as const;
}
