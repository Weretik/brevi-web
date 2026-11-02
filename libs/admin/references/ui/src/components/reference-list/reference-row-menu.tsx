import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Divider, ListItemIcon, Menu, MenuItem } from '@mui/material';

interface MenuRow {
  id: number;
  name: string;
}

interface Props<Row extends MenuRow> {
  row: Row | null;
  anchorPosition: { left: number; top: number } | null;
  /** Menu label when no row is open, e.g. «Дії постачальника». */
  fallbackLabel: string;
  onClose: (restoreFocus?: boolean) => void;
  onView: (row: Row) => void;
  onEdit: (row: Row) => void;
  onDelete: (id: number) => void;
}

/** Row actions of «Цех» reference grids: view, edit, delete. */
export function ReferenceRowMenu<Row extends MenuRow>({
  row,
  anchorPosition,
  fallbackLabel,
  onClose,
  onView,
  onEdit,
  onDelete,
}: Props<Row>) {
  function run(action: (value: Row) => void) {
    onClose(false);
    if (row) action(row);
  }

  return (
    <Menu
      open={row !== null}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition ?? undefined}
      onClose={() => onClose()}
      slotProps={{ list: { 'aria-label': row ? `Дії: ${row.name}` : fallbackLabel } }}
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
      <MenuItem sx={{ color: 'error.main' }} onClick={() => run((value) => onDelete(value.id))}>
        <ListItemIcon sx={{ color: 'inherit' }}>
          <DeleteOutlineIcon fontSize="small" />
        </ListItemIcon>
        Видалити
      </MenuItem>
    </Menu>
  );
}
