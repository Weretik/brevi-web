import LogoutIcon from '@mui/icons-material/Logout';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import { Avatar, IconButton, ListItemIcon, Menu, MenuItem, Tooltip } from '@mui/material';
import { useState } from 'react';

import { useAdminShellLogout } from '../../../providers/admin-shell-session-provider';

/** Profile avatar with the session actions available to the shell. */
export function ProfileMenu() {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const logout = useAdminShellLogout();
  const isOpen = Boolean(anchorElement);

  return (
    <>
      <Tooltip title="Профіль">
        <IconButton
          aria-controls={isOpen ? 'admin-profile-menu' : undefined}
          aria-expanded={isOpen ? 'true' : undefined}
          aria-haspopup="menu"
          aria-label="Профіль"
          onClick={(event) => setAnchorElement(event.currentTarget)}
          sx={{ p: 0 }}
        >
          <Avatar
            sx={{
              bgcolor: 'primary.light',
              border: 1,
              borderColor: 'divider',
              color: 'primary.dark',
              height: 40,
              width: 40,
            }}
          >
            <PersonOutlineIcon fontSize="small" />
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorElement}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        id="admin-profile-menu"
        onClose={() => setAnchorElement(null)}
        open={isOpen}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <MenuItem disabled>Профіль скоро з'явиться</MenuItem>
        {logout ? (
          <MenuItem
            onClick={() => {
              setAnchorElement(null);
              void logout();
            }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Вийти
          </MenuItem>
        ) : null}
      </Menu>
    </>
  );
}
