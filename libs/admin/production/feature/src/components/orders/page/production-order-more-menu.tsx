import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import { useState } from 'react';

import type { SxProps, Theme } from '@mui/material';
import type { ReactNode } from 'react';

export interface ProductionOrderAction {
  label: string;
  icon: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  run: () => void;
}

interface Props {
  common: ProductionOrderAction[];
  /** Shown after a line, in red. */
  dangerous: ProductionOrderAction[];
  buttonSx: SxProps<Theme>;
}

/** «⋯» of the order header: the rarer actions, then the dangerous ones after a line. */
export function ProductionOrderMoreMenu({ common, dangerous, buttonSx }: Props) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const item = (action: ProductionOrderAction) => (
    <MenuItem
      key={action.label}
      disabled={action.disabled}
      sx={action.danger ? { color: 'error.main' } : undefined}
      onClick={() => {
        setAnchor(null);
        action.run();
      }}
    >
      <ListItemIcon sx={action.danger ? { color: 'error.main' } : undefined}>
        {action.icon}
      </ListItemIcon>
      <ListItemText>{action.label}</ListItemText>
    </MenuItem>
  );

  return (
    <>
      <Tooltip title="Ще">
        <IconButton
          aria-label="Ще дії"
          aria-haspopup="menu"
          aria-expanded={anchor ? true : undefined}
          onClick={(event) => setAnchor(event.currentTarget)}
          sx={buttonSx}
        >
          <MoreHorizIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {common.map(item)}
        {dangerous.length > 0 && <Divider />}
        {dangerous.map(item)}
      </Menu>
    </>
  );
}
