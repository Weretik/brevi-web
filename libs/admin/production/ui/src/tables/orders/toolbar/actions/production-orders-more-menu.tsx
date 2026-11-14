import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { IconButton, ListItemIcon, ListSubheader, Menu, MenuItem, Tooltip } from '@mui/material';
import { useState } from 'react';

export type ProductionOrdersImport = 'orders' | 'progress' | 'prices';

const items: { kind: ProductionOrdersImport; label: string }[] = [
  { kind: 'orders', label: 'Імпорт завдань' },
  { kind: 'progress', label: 'Імпорт етапів' },
  { kind: 'prices', label: 'Ціни КП' },
];

/** «⋯» of the list header: the one-time transfers from the old «Цех», kept out of the everyday buttons. */
export function ProductionOrdersMoreMenu({
  onImport,
}: {
  onImport: (kind: ProductionOrdersImport) => void;
}) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  return (
    <>
      <Tooltip title="Ще">
        <IconButton
          aria-label="Ще дії"
          aria-haspopup="menu"
          aria-expanded={anchor ? true : undefined}
          onClick={(event) => setAnchor(event.currentTarget)}
          sx={{ border: 1, borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper' }}
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
        <ListSubheader sx={{ lineHeight: 2.5, bgcolor: 'transparent' }}>
          Перенесення зі старого «Цеху»
        </ListSubheader>
        {items.map((item) => (
          <MenuItem
            key={item.kind}
            onClick={() => {
              setAnchor(null);
              onImport(item.kind);
            }}
          >
            <ListItemIcon>
              <UploadFileOutlinedIcon fontSize="small" />
            </ListItemIcon>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
