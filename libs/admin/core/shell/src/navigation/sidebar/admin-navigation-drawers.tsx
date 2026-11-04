import { Drawer } from '@mui/material';

import { getNavigationPalette } from '../navigation-palette';
import { AdminNavigationPanel } from './admin-navigation-panel';

import type { AdminNavigationGroup } from '../../shell.types';

export const navigationWidth = { expanded: 272, collapsed: 80 } as const;

interface AdminNavigationDrawersProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  navigation: readonly AdminNavigationGroup[];
  homeHint?: string | null;
  onMobileClose: () => void;
  onToggleCollapsed: () => void;
}

export function AdminNavigationDrawers({
  isCollapsed,
  isMobileOpen,
  navigation,
  homeHint = null,
  onMobileClose,
  onToggleCollapsed,
}: AdminNavigationDrawersProps) {
  const desktopWidth = isCollapsed ? navigationWidth.collapsed : navigationWidth.expanded;

  return (
    <>
      <Drawer
        open
        slotProps={{
          paper: {
            sx: (theme) => ({
              bgcolor: getNavigationPalette(theme).background,
              borderColor: getNavigationPalette(theme).divider,
              boxSizing: 'border-box',
              overflowX: 'hidden',
              transition: theme.transitions.create('width', {
                duration: theme.transitions.duration.complex,
                easing: theme.transitions.easing.easeOut,
              }),
              width: desktopWidth,
            }),
          },
        }}
        sx={{ display: { xs: 'none', lg: 'block' }, width: desktopWidth }}
        variant="permanent"
      >
        <AdminNavigationPanel
          collapsed={isCollapsed}
          groups={navigation}
          homeHint={homeHint}
          mobile={false}
          onToggleCollapsed={onToggleCollapsed}
        />
      </Drawer>
      <Drawer
        onClose={onMobileClose}
        open={isMobileOpen}
        slotProps={{
          paper: {
            sx: (theme) => ({
              bgcolor: getNavigationPalette(theme).background,
              boxSizing: 'border-box',
              width: navigationWidth.expanded,
            }),
          },
        }}
        sx={{ display: { xs: 'block', lg: 'none' } }}
        variant="temporary"
      >
        <AdminNavigationPanel
          collapsed={false}
          groups={navigation}
          homeHint={homeHint}
          mobile
          onNavigate={onMobileClose}
        />
      </Drawer>
    </>
  );
}
