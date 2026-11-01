import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, IconButton, Toolbar } from '@mui/material';
import { alpha } from '@mui/material/styles';

import { AdminBreadcrumbs } from './admin-breadcrumbs';
import { ColorSchemeMenu } from './color-scheme-menu';
import { topBarIconButtonSx } from './top-bar-icon-button';

import type { AdminColorMode, AdminNavigationGroup } from '../../shell.types';
import type { RefObject } from 'react';

interface AdminTopBarProps {
  colorMode: AdminColorMode;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
  navigation: readonly AdminNavigationGroup[];
  onColorModeChange: (mode: AdminColorMode) => void;
  onMenuOpen: () => void;
}

export function AdminTopBar({
  colorMode,
  menuButtonRef,
  navigation,
  onColorModeChange,
  onMenuOpen,
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
        <ColorSchemeMenu mode={colorMode} onModeChange={onColorModeChange} />
      </Toolbar>
    </AppBar>
  );
}
