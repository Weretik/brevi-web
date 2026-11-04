import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, IconButton, Toolbar } from '@mui/material';
import { alpha } from '@mui/material/styles';

import { ColorSchemeMenu } from './actions/color-scheme-menu';
import { NotificationsMenu } from './actions/notifications-menu';
import { ProfileMenu } from './actions/profile-menu';
import { topBarIconButtonSx } from './actions/top-bar-icon-button';
import { TopBarSearch } from './actions/top-bar-search';
import { AdminBreadcrumbs } from './admin-breadcrumbs';

import type { AdminColorMode, AdminNavigationGroup, AdminShellUser } from '../../shell.types';
import type { RefObject } from 'react';

interface AdminTopBarProps {
  colorMode: AdminColorMode;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
  navigation: readonly AdminNavigationGroup[];
  onColorModeChange: (mode: AdminColorMode) => void;
  onMenuOpen: () => void;
  user: AdminShellUser | null;
  profileHref: string | null;
}

export function AdminTopBar({
  colorMode,
  menuButtonRef,
  navigation,
  onColorModeChange,
  onMenuOpen,
  profileHref,
  user,
}: AdminTopBarProps) {
  return (
    <AppBar
      color="inherit"
      elevation={0}
      position="sticky"
      sx={(theme) => ({
        backdropFilter: 'blur(10px)',
        bgcolor: alpha(theme.palette.background.default, 0.85),
        borderBottom: 1,
        borderColor: 'divider',
      })}
    >
      <Toolbar sx={{ gap: 1.5, minHeight: { xs: 64 }, px: { xs: 2, sm: 3, lg: 3.5 } }}>
        <IconButton
          aria-label="Відкрити меню навігації"
          onClick={onMenuOpen}
          ref={menuButtonRef}
          sx={{ ...topBarIconButtonSx, display: { lg: 'none' } }}
        >
          <MenuIcon fontSize="small" />
        </IconButton>
        <AdminBreadcrumbs navigation={navigation} />
        <TopBarSearch />
        <NotificationsMenu />
        <ColorSchemeMenu mode={colorMode} onModeChange={onColorModeChange} />
        <ProfileMenu profileHref={profileHref} user={user} />
      </Toolbar>
    </AppBar>
  );
}
