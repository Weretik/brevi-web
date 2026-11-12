import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import { Button, Divider, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { Fragment, useState } from 'react';

import type { ReactNode } from 'react';

export interface WarehouseMoreAction {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  secondary?: string;
  disabled?: boolean;
  /** A line above it: rare service actions go last. */
  divided?: boolean;
}

interface Props {
  actions: readonly WarehouseMoreAction[];
}

/** «Ще» of a «Склад тканин» page: the rare actions in one menu; nothing is shown without any. */
export function WarehouseMoreMenu({ actions }: Props) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  if (actions.length === 0) return null;
  return (
    <>
      <Button
        variant="outlined"
        startIcon={<MoreHorizOutlinedIcon />}
        aria-haspopup="menu"
        aria-expanded={anchor !== null}
        onClick={(event) => setAnchor(event.currentTarget)}
      >
        Ще
      </Button>
      <Menu
        anchorEl={anchor}
        open={anchor !== null}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {actions.map((action) => (
          <Fragment key={action.label}>
            {action.divided && <Divider />}
            <MenuItem
              disabled={action.disabled}
              onClick={() => {
                setAnchor(null);
                action.onClick();
              }}
            >
              <ListItemIcon>{action.icon}</ListItemIcon>
              <ListItemText primary={action.label} secondary={action.secondary} />
            </MenuItem>
          </Fragment>
        ))}
      </Menu>
    </>
  );
}
