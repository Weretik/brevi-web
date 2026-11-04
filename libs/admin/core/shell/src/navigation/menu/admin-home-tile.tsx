import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import { Box, ButtonBase, Divider, Tooltip, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import { getNavigationPalette } from '../navigation-palette';

export const homeLabel = 'Робочий стіл';
const defaultHint = 'Що чекає сьогодні';

interface Props {
  collapsed: boolean;
  isHome: boolean;
  /** Second line, e.g. «Сьогодні · 3 завдання горять»; a neutral line when nothing burns. */
  hint?: string | null;
  onNavigate?: () => void;
}

/**
 * «Робочий стіл» (H2): a separate tile above the menu with what waits today and a line under
 * it, so the start page does not merge with the logo or the sections.
 */
export function AdminHomeTile({ collapsed, isHome, hint = null, onNavigate }: Props) {
  const tile = (
    <ButtonBase
      aria-current={isHome ? 'page' : undefined}
      aria-label={homeLabel}
      component={Link}
      onClick={onNavigate}
      to="/"
      sx={(theme) => {
        const nav = getNavigationPalette(theme);
        return {
          alignItems: 'center',
          bgcolor: isHome ? nav.activeBackground : nav.hover,
          border: `1px solid ${nav.divider}`,
          borderRadius: 2,
          color: isHome ? nav.activeText : nav.text,
          display: 'flex',
          gap: 1.25,
          justifyContent: collapsed ? 'center' : 'flex-start',
          overflow: 'hidden',
          px: collapsed ? 0.75 : 1.25,
          py: 1,
          textAlign: 'left',
          width: '100%',
          transition: theme.transitions.create(['background-color', 'border-color'], {
            duration: theme.transitions.duration.shortest,
          }),
          '&:hover': { borderColor: nav.textMuted },
          '&.Mui-focusVisible': { outline: `2px solid ${nav.activeBackground}`, outlineOffset: 2 },
        };
      }}
    >
      <Box
        aria-hidden
        sx={(theme) => {
          const nav = getNavigationPalette(theme);
          return {
            alignItems: 'center',
            bgcolor: isHome ? nav.activeText : nav.activeBackground,
            borderRadius: 1.5,
            color: isHome ? nav.activeBackground : nav.activeText,
            display: 'grid',
            flex: 'none',
            height: 28,
            justifyItems: 'center',
            width: 28,
          };
        }}
      >
        <SpaceDashboardOutlinedIcon sx={{ fontSize: 18 }} />
      </Box>
      {!collapsed && (
        <Box sx={{ minWidth: 0 }}>
          <Typography noWrap sx={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>
            {homeLabel}
          </Typography>
          <Typography
            noWrap
            sx={(theme) => ({
              color: isHome ? 'inherit' : getNavigationPalette(theme).textMuted,
              fontSize: 11.5,
              lineHeight: 1.3,
              opacity: isHome ? 0.8 : 1,
            })}
          >
            {hint ?? defaultHint}
          </Typography>
        </Box>
      )}
    </ButtonBase>
  );

  return (
    <Box component="li" sx={{ listStyle: 'none' }}>
      {collapsed ? (
        <Tooltip placement="right" title={hint ? `${homeLabel} · ${hint}` : homeLabel}>
          {tile}
        </Tooltip>
      ) : (
        tile
      )}
      <Divider
        aria-hidden
        sx={(theme) => ({ borderColor: getNavigationPalette(theme).divider, mt: 1.25, mx: 0.5 })}
      />
    </Box>
  );
}
