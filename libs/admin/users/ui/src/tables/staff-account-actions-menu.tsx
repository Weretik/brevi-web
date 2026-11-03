import { staffRoleLabels } from '@admin/users/model';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';

import type { StaffAccount, StaffRole } from '@admin/users/model';
import type { MouseEvent } from 'react';

export type StaffAccountAction =
  | { type: 'changeRole'; role: StaffRole }
  | { type: 'setBlocked'; blocked: boolean }
  | { type: 'setPassword' };

interface StaffAccountActionsMenuProps {
  account: StaffAccount;
  /** The signed-in admin cannot demote or block themselves. */
  isCurrentUser: boolean;
  onAction: (account: StaffAccount, action: StaffAccountAction) => void;
}

export function StaffAccountActionsMenu({
  account,
  isCurrentUser,
  onAction,
}: StaffAccountActionsMenuProps) {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const otherRole: StaffRole = account.role === 'Admin' ? 'Manager' : 'Admin';
  const menuId = `staff-actions-${account.id}`;

  const run = (action: StaffAccountAction) => {
    setAnchorElement(null);
    onAction(account, action);
  };

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
        <MenuItem
          disabled={isCurrentUser}
          onClick={() => run({ type: 'changeRole', role: otherRole })}
        >
          Зробити: {staffRoleLabels[otherRole].toLowerCase()}
        </MenuItem>
        <MenuItem onClick={() => run({ type: 'setPassword' })}>Встановити новий пароль</MenuItem>
        <MenuItem
          disabled={isCurrentUser && !account.isBlocked}
          onClick={() => run({ type: 'setBlocked', blocked: !account.isBlocked })}
          sx={account.isBlocked ? undefined : { color: 'error.main' }}
        >
          {account.isBlocked ? 'Розблокувати' : 'Заблокувати'}
        </MenuItem>
      </Menu>
    </>
  );
}
