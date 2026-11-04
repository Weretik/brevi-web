import { Box, CircularProgress, Container } from '@mui/material';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { AdminTopBar } from '../components/top-bar/admin-top-bar';
import {
  AdminNavigationDrawers,
  navigationWidth,
} from '../navigation/sidebar/admin-navigation-drawers';
import { useNavigationCollapsed } from '../navigation/sidebar/use-navigation-collapsed';

import type { AdminColorMode, AdminNavigationGroup, AdminShellUser } from '../shell.types';

interface AdminLayoutProps {
  navigation: readonly AdminNavigationGroup[];
  colorMode: AdminColorMode;
  onColorModeChange: (mode: AdminColorMode) => void;
  /** The signed-in staff member for the profile menu. */
  user?: AdminShellUser | null;
  /** Route of «Мій кабінет». */
  profileHref?: string | null;
}

export function AdminLayout({
  navigation,
  colorMode,
  onColorModeChange,
  profileHref = null,
  user = null,
}: AdminLayoutProps) {
  const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);
  const { isCollapsed, toggleCollapsed } = useNavigationCollapsed();
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
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileNavigationOpen}
        navigation={navigation}
        onMobileClose={closeMobileNavigation}
        onToggleCollapsed={toggleCollapsed}
      />
      <Box
        sx={(theme) => ({
          marginLeft: {
            lg: `${isCollapsed ? navigationWidth.collapsed : navigationWidth.expanded}px`,
          },
          minWidth: 0,
          transition: theme.transitions.create('margin-left', {
            duration: theme.transitions.duration.complex,
            easing: theme.transitions.easing.easeOut,
          }),
        })}
      >
        <AdminTopBar
          colorMode={colorMode}
          menuButtonRef={menuButtonRef}
          navigation={navigation}
          onColorModeChange={onColorModeChange}
          onMenuOpen={() => setIsMobileNavigationOpen(true)}
          profileHref={profileHref}
          user={user}
        />
        <Box component="main" sx={{ minWidth: 0 }}>
          <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, lg: 3.5 }, py: { xs: 2.5, lg: 3.5 } }}>
            <Suspense fallback={<CircularProgress aria-label="Завантаження сторінки" />}>
              <Outlet />
            </Suspense>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
