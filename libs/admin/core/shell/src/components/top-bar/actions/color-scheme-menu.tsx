import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeIcon from '@mui/icons-material/LightModeOutlined';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightnessOutlined';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { useState, type MouseEvent } from 'react';

import { topBarIconButtonSx } from './top-bar-icon-button';

import type { AdminColorMode } from '../../../layout/admin-shell-contract';

interface ColorSchemeMenuProps {
  mode: AdminColorMode;
  onModeChange: (mode: AdminColorMode) => void;
}

const modes: { label: string; value: AdminColorMode }[] = [
  { label: 'Світла', value: 'light' },
  { label: 'Темна', value: 'dark' },
  { label: 'Системна', value: 'system' },
];

export function ColorSchemeMenu({ mode, onModeChange }: ColorSchemeMenuProps) {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const isOpen = Boolean(anchorElement);
  const ModeIcon =
    mode === 'dark' ? DarkModeIcon : mode === 'light' ? LightModeIcon : SettingsBrightnessIcon;

  const chooseMode = (nextMode: AdminColorMode) => {
    onModeChange(nextMode);
    setAnchorElement(null);
  };

  return (
    <>
      <Tooltip title="Тема оформлення">
        <IconButton
          aria-controls={isOpen ? 'admin-color-scheme-menu' : undefined}
          aria-expanded={isOpen ? 'true' : undefined}
          aria-haspopup="menu"
          aria-label="Вибрати тему оформлення"
          onClick={(event: MouseEvent<HTMLElement>) => setAnchorElement(event.currentTarget)}
          sx={topBarIconButtonSx}
        >
          <ModeIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorElement}
        id="admin-color-scheme-menu"
        onClose={() => setAnchorElement(null)}
        open={isOpen}
      >
        {modes.map(({ label, value }) => (
          <MenuItem key={value} onClick={() => chooseMode(value)} selected={mode === value}>
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
