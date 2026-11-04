import { staffRoleLabels } from '@admin/users/model';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Divider, IconButton, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';

import type { StaffAccount, StaffAccountPermissions, StaffRole } from '@admin/users/model';
import type { MouseEvent } from 'react';

export type StaffAccountAction =
  | { type: 'changeRole'; role: StaffRole }
  | { type: 'setBlocked'; blocked: boolean }
  | { type: 'setPassword' }
  | { type: 'editDetails' }
  | { type: 'delete' };

interface StaffAccountActionsMenuProps {
  account: StaffAccount;
  /** What the signed-in staff member may do with this account. */
  permissions: StaffAccountPermissions;
  onAction: (account: StaffAccount, action: StaffAccountAction) => void;
}

export function StaffAccountActionsMenu({
  account,
  onAction,
  permissions,
}: StaffAccountActionsMenuProps) {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const menuId = `staff-actions-${account.id}`;
  const hasActions =
    permissions.roleChoices.length > 0 ||
    permissions.canSetPassword ||
    permissions.canEditDetails ||
    permissions.canBlock ||
    permissions.canDelete;

  const run = (action: StaffAccountAction) => {
    setAnchorElement(null);
    onAction(account, action);
  };

  if (!hasActions) return null;

  return (
    <>
      <IconButton
        aria-controls={anchorElement ? menuId : undefined}
        aria-haspopup="menu"
        aria-label={`Дії для ${account.email}`}
        onClick={(event: MouseEvent<HTMLElement>) => setAnchorElement(event.currentTarget)}
        size="small"
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorElement}
        id={menuId}
        onClose={() => setAnchorElement(null)}
        open={Boolean(anchorElement)}
      >
        {permissions.canEditDetails ? (
          <MenuItem onClick={() => run({ type: 'editDetails' })}>Змінити дані</MenuItem>
        ) : null}
        {permissions.roleChoices.map((role) => (
          <MenuItem key={role} onClick={() => run({ type: 'changeRole', role })}>
            Зробити: {staffRoleLabels[role].toLowerCase()}
          </MenuItem>
        ))}
        {permissions.canSetPassword ? (
          <MenuItem onClick={() => run({ type: 'setPassword' })}>Встановити новий пароль</MenuItem>
        ) : null}
        {permissions.canBlock ? (
          <MenuItem
            onClick={() => run({ type: 'setBlocked', blocked: !account.isBlocked })}
            sx={account.isBlocked ? undefined : { color: 'error.main' }}
          >
            {account.isBlocked ? 'Розблокувати' : 'Заблокувати'}
          </MenuItem>
        ) : null}
        {permissions.canDelete ? <Divider /> : null}
        {permissions.canDelete ? (
          <MenuItem onClick={() => run({ type: 'delete' })} sx={{ color: 'error.main' }}>
            Видалити
          </MenuItem>
        ) : null}
      </Menu>
    </>
  );
}
