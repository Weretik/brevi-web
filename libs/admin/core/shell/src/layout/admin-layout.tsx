import { Box, CircularProgress, Container } from '@mui/material';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { AdminTopBar } from '../components/admin-top-bar';
import {
  AdminNavigationDrawers,
  navigationDrawerWidth,
} from '../navigation/admin-navigation-drawers';

import type { AdminColorMode, AdminNavigationGroup } from '../shell.types';

interface AdminLayoutProps {
  navigation: readonly AdminNavigationGroup[];
  colorMode: AdminColorMode;
  onColorModeChange: (mode: AdminColorMode) => void;
}

export function AdminLayout({ navigation, colorMode, onColorModeChange }: AdminLayoutProps) {
  const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  useEffect(() => {
    setIsMobileNavigationOpen(false);
  }, [location.pathname]);

  const closeMobileNavigation = () => {
    setIsMobileNavigationOpen(false);
    window.setTimeout(() => menuButtonRef.current?.focus(), 0);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <AdminNavigationDrawers
        isMobileOpen={isMobileNavigationOpen}
        navigation={navigation}
        onMobileClose={closeMobileNavigation}
      />
      <Box sx={{ marginLeft: { lg: `${navigationDrawerWidth}px` }, minWidth: 0 }}>
        <AdminTopBar
          colorMode={colorMode}
          menuButtonRef={menuButtonRef}
          onColorModeChange={onColorModeChange}
          onMenuOpen={() => setIsMobileNavigationOpen(true)}
        />
        <Box component="main" sx={{ minWidth: 0 }}>
          <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, lg: 5 } }}>
            <Suspense fallback={<CircularProgress aria-label="Завантаження сторінки" />}>
              <Outlet />
            </Suspense>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
