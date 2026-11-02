import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Divider, ListItemIcon, Menu, MenuItem } from '@mui/material';

import type { Supplier } from '@admin/references/model';

interface Props {
  row: Supplier | null;
  anchorPosition: { left: number; top: number } | null;
  onClose: (restoreFocus?: boolean) => void;
  onView: (row: Supplier) => void;
  onEdit: (row: Supplier) => void;
  onDelete: (id: number) => void;
}

export function SupplierRowMenu({ row, anchorPosition, onClose, onView, onEdit, onDelete }: Props) {
  function run(action: (supplier: Supplier) => void) {
    onClose(false);
    if (row) action(row);
  }

  return (
    <Menu
      open={row !== null}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition ?? undefined}
      onClose={() => onClose()}
      slotProps={{ list: { 'aria-label': row ? `Дії: ${row.name}` : 'Дії постачальника' } }}
    >
      <MenuItem onClick={() => run(onView)}>
        <ListItemIcon>
          <VisibilityOutlinedIcon fontSize="small" />
        </ListItemIcon>
        Переглянути
      </MenuItem>
      <MenuItem onClick={() => run(onEdit)}>
        <ListItemIcon>
          <EditOutlinedIcon fontSize="small" />
        </ListItemIcon>
        Редагувати
      </MenuItem>
      <Divider />
      <MenuItem
        sx={{ color: 'error.main' }}
        onClick={() => run((supplier) => onDelete(supplier.id))}
      >
        <ListItemIcon sx={{ color: 'inherit' }}>
          <DeleteOutlineIcon fontSize="small" />
        </ListItemIcon>
        Видалити
      </MenuItem>
    </Menu>
  );
}
