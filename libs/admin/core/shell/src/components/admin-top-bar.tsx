import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';

import { ColorSchemeMenu } from './color-scheme-menu';

import type { AdminColorMode } from '../shell.types';
import type { RefObject } from 'react';

interface AdminTopBarProps {
  colorMode: AdminColorMode;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
  onColorModeChange: (mode: AdminColorMode) => void;
  onMenuOpen: () => void;
}

export function AdminTopBar({
  colorMode,
  menuButtonRef,
  onColorModeChange,
  onMenuOpen,
}: AdminTopBarProps) {
  return (
    <AppBar
      color="inherit"
      elevation={0}
      position="sticky"
      sx={{ borderBottom: 1, borderColor: 'divider' }}
    >
      <Toolbar sx={{ gap: 2, minHeight: 70, px: { xs: 2, sm: 3 } }}>
        <IconButton
          aria-label="Відкрити меню навігації"
          onClick={onMenuOpen}
          ref={menuButtonRef}
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 1.5,
            color: 'primary.main',
            display: { lg: 'none' },
            height: 40,
            width: 40,
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="span"
          noWrap
          sx={{ flexGrow: 1, fontSize: { xs: 17, sm: 18 }, fontWeight: 700, minWidth: 0 }}
          variant="h6"
        >
          <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
            Brevi Admin
          </Box>
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
            Адміністрування Brevi
          </Box>
        </Typography>
        <ColorSchemeMenu mode={colorMode} onModeChange={onColorModeChange} />
      </Toolbar>
    </AppBar>
  );
}
