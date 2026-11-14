import { UserAvatar } from '@admin/shared/ui';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ProfileCard } from './profile-card';
import { useAdminShellLogout } from '../../../providers/admin-shell-session-provider';

import type { AdminShellUser } from '../../../layout/admin-shell-contract';

interface ProfileMenuProps {
  user: AdminShellUser | null;
  /** Route of «Мій кабінет». */
  profileHref: string | null;
}

/** The signed-in person's photo; opens who they are, «Мій кабінет» and «Вийти». */
export function ProfileMenu({ profileHref, user }: ProfileMenuProps) {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const logout = useAdminShellLogout();
  const navigate = useNavigate();
  const isOpen = Boolean(anchorElement);
  const close = () => setAnchorElement(null);

  return (
    <>
      <Tooltip title="Профіль">
        <IconButton
          aria-controls={isOpen ? 'admin-profile-menu' : undefined}
          aria-expanded={isOpen ? 'true' : undefined}
          aria-haspopup="menu"
          aria-label="Профіль"
          onClick={(event) => setAnchorElement(event.currentTarget)}
          sx={{ p: 0.25 }}
        >
          <UserAvatar
            avatarUrl={user?.avatarUrl}
            email={user?.email}
            name={user?.fullName ?? ''}
            size={36}
          />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorElement}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        id="admin-profile-menu"
        onClose={close}
        open={isOpen}
        slotProps={{ paper: { sx: { maxWidth: 320, minWidth: 260 } } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        {user ? <ProfileCard user={user} /> : null}
        {user ? <Divider /> : null}
        {profileHref ? (
          <MenuItem
            onClick={() => {
              close();
              void navigate(profileHref);
            }}
          >
            <ListItemIcon>
              <AccountCircleOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Мій кабінет
          </MenuItem>
        ) : null}
        {logout ? (
          <MenuItem
            onClick={() => {
              close();
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
