import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import { Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';

interface Props {
  label: string;
  isFirst: boolean;
  isLast: boolean;
  onMove: (offset: -1 | 1) => void;
  onRemove: () => void;
}

/** «⋯» of an item: move it up or down in the КП, or remove it. */
export function QuoteItemMenu({ label, isFirst, isLast, onMove, onRemove }: Props) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const pick = (action: () => void) => () => {
    setAnchor(null);
    action();
  };
  return (
    <>
      <IconButton
        aria-label={`Дії з позицією: ${label}`}
        aria-haspopup="menu"
        aria-expanded={anchor !== null}
        onClick={(event) => setAnchor(event.currentTarget)}
      >
        <MoreHorizOutlinedIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={anchor !== null}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem disabled={isFirst} onClick={pick(() => onMove(-1))}>
          <ListItemIcon>
            <ArrowUpwardOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Перемістити вище" />
        </MenuItem>
        <MenuItem disabled={isLast} onClick={pick(() => onMove(1))}>
          <ListItemIcon>
            <ArrowDownwardOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Перемістити нижче" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={pick(onRemove)} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'inherit' }}>
            <DeleteOutlineOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Прибрати з КП" />
        </MenuItem>
      </Menu>
    </>
  );
}
