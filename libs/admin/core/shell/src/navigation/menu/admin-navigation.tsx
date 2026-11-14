import { Box, List, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Fragment } from 'react';
import { useLocation } from 'react-router-dom';

import { AdminHomeTile } from './admin-home-tile';
import { AdminNavigationGroup } from './admin-navigation-group';
import { getNavigationPalette } from '../navigation-palette';

import type { AdminNavigationGroup as NavigationGroup } from '../../layout/admin-shell-contract';

interface AdminNavigationProps {
  ariaLabel: string;
  collapsed: boolean;
  groups: readonly NavigationGroup[];
  listPrefix: string;
  /** Second line of the «Робочий стіл» tile. */
  homeHint?: string | null;
  onNavigate?: () => void;
}

export function AdminNavigation({
  ariaLabel,
  collapsed,
  groups,
  listPrefix,
  homeHint = null,
  onNavigate,
}: AdminNavigationProps) {
  const { pathname } = useLocation();
  return (
    <Box
      aria-label={ariaLabel}
      component="nav"
      sx={(theme) => {
        const nav = getNavigationPalette(theme);
        const thumb = alpha(nav.textMuted, 0.35);
        // Thin scrollbar in the sidebar colors instead of the light system one.
        return {
          flex: 1,
          minHeight: 0,
          overflowX: 'hidden',
          overflowY: 'auto',
          pb: 2,
          // Space between the logo and «Робочий стіл», so the tile does not merge with the logo.
          pt: 1.5,
          px: 1.5,
          scrollbarColor: `${thumb} ${nav.background}`,
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': { width: 8 },
          '&::-webkit-scrollbar-track': { background: nav.background },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: thumb,
            border: `2px solid ${nav.background}`,
            borderRadius: 8,
          },
          '&::-webkit-scrollbar-thumb:hover': { backgroundColor: nav.textMuted },
          '&::-webkit-scrollbar-button': { display: 'none', height: 0 },
        };
      }}
    >
      <List disablePadding>
        <AdminHomeTile
          collapsed={collapsed}
          hint={homeHint}
          isHome={pathname === '/'}
          onNavigate={onNavigate}
        />
        {groups.map((group, index) => {
          const startsSection = group.section && group.section !== groups[index - 1]?.section;
          return (
            <Fragment key={group.id}>
              {startsSection ? (
                <Box aria-hidden={collapsed} component="li" sx={{ listStyle: 'none' }}>
                  <Typography
                    component="p"
                    noWrap
                    sx={(theme) => ({
                      color: getNavigationPalette(theme).textMuted,
                      height: collapsed ? 12 : 'auto',
                      opacity: collapsed ? 0 : 0.8,
                      pb: collapsed ? 0 : 0.75,
                      pt: collapsed ? 0 : 2,
                      px: 1.25,
                      transition: 'opacity 150ms',
                    })}
                    variant="overline"
                  >
                    {group.section}
                  </Typography>
                </Box>
              ) : null}
              <AdminNavigationGroup
                collapsed={collapsed}
                group={group}
                listId={`${listPrefix}-${group.id}`}
                onNavigate={onNavigate}
                pathname={pathname}
              />
            </Fragment>
          );
        })}
      </List>
    </Box>
  );
}
