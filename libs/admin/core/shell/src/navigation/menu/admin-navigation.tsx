import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { AdminNavigationGroup } from './admin-navigation-group';
import { navigationRowSx } from './navigation-row';
import { getNavigationPalette } from '../navigation-palette';

import type { AdminNavigationGroup as NavigationGroup } from '../../shell.types';

interface AdminNavigationProps {
  ariaLabel: string;
  collapsed: boolean;
  groups: readonly NavigationGroup[];
  listPrefix: string;
  onNavigate?: () => void;
}

export const homeLabel = 'Головна';

export function AdminNavigation({
  ariaLabel,
  collapsed,
  groups,
  listPrefix,
  onNavigate,
}: AdminNavigationProps) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const homeLink = (
    <ListItemButton
      aria-current={isHome ? 'page' : undefined}
      aria-label={homeLabel}
      component={Link}
      onClick={onNavigate}
      selected={isHome}
      sx={navigationRowSx}
      to="/"
    >
      <ListItemIcon sx={{ color: 'inherit', minWidth: 0, mr: 1.5 }}>
        <SpaceDashboardOutlinedIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText
        primary={homeLabel}
        slotProps={{ primary: { noWrap: true, sx: { fontSize: 14, fontWeight: 600 } } }}
        sx={{ opacity: collapsed ? 0 : 1, transition: 'opacity 150ms' }}
      />
    </ListItemButton>
  );

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
          // Space between the logo and «Головна», so the first item does not merge with the logo.
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
        <Box component="li" sx={{ listStyle: 'none', mb: 0.25 }}>
          {collapsed ? (
            <Tooltip placement="right" title={homeLabel}>
              {homeLink}
            </Tooltip>
          ) : (
            homeLink
          )}
        </Box>
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
