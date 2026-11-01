import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { IconButton, Menu, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';

import { topBarIconButtonSx } from './top-bar-icon-button';

/** Notifications entry point; shows an empty state until notifications have a backend. */
export function NotificationsMenu() {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const isOpen = Boolean(anchorElement);

  return (
    <>
      <Tooltip title="Сповіщення">
        <IconButton
          aria-controls={isOpen ? 'admin-notifications-menu' : undefined}
          aria-expanded={isOpen ? 'true' : undefined}
          aria-haspopup="menu"
          aria-label="Сповіщення"
          onClick={(event) => setAnchorElement(event.currentTarget)}
          sx={topBarIconButtonSx}
        >
          <NotificationsNoneOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorElement}
        id="admin-notifications-menu"
        onClose={() => setAnchorElement(null)}
        open={isOpen}
        slotProps={{ list: { 'aria-label': 'Сповіщення' }, paper: { sx: { minWidth: 260 } } }}
      >
        <Typography component="li" sx={{ color: 'text.secondary', px: 2, py: 1.5 }} variant="body2">
          Нових сповіщень немає
        </Typography>
      </Menu>
    </>
  );
}
