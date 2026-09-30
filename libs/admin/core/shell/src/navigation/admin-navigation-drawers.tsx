import { Drawer } from '@mui/material';

import { AdminNavigationPanel } from './admin-navigation-panel';

import type { AdminNavigationGroup } from '../shell.types';

export const navigationDrawerWidth = 280;

interface AdminNavigationDrawersProps {
  isMobileOpen: boolean;
  navigation: readonly AdminNavigationGroup[];
  onMobileClose: () => void;
}

export function AdminNavigationDrawers({
  isMobileOpen,
  navigation,
  onMobileClose,
}: AdminNavigationDrawersProps) {
  return (
    <>
      <Drawer
        open
        slotProps={{
          paper: {
            sx: {
              bgcolor: '#17171b',
              borderColor: 'rgba(255, 255, 255, 0.12)',
              boxSizing: 'border-box',
              width: navigationDrawerWidth,
            },
          },
        }}
        sx={{ display: { xs: 'none', lg: 'block' }, width: navigationDrawerWidth }}
        variant="permanent"
      >
        <AdminNavigationPanel groups={navigation} mobile={false} />
      </Drawer>
      <Drawer
        onClose={onMobileClose}
        open={isMobileOpen}
        slotProps={{
          paper: {
            sx: {
              bgcolor: '#17171b',
              boxSizing: 'border-box',
              width: navigationDrawerWidth,
            },
          },
        }}
        sx={{ display: { xs: 'block', lg: 'none' } }}
        variant="temporary"
      >
        <AdminNavigationPanel groups={navigation} mobile onNavigate={onMobileClose} />
      </Drawer>
    </>
  );
}
