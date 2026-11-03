import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Divider, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

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
  /** «Переглянути» by default; e.g. «Швидкий перегляд» when the row also has a full page. */
  viewLabel?: string;
  /** Adds «Відкрити повну картку» that opens this page. */
  openHref?: (row: Row) => string;
}

/** Row actions of «Цех» reference grids: view, open the full page (optional), edit, delete. */
export function ReferenceRowMenu<Row extends MenuRow>({
  row,
  anchorPosition,
  fallbackLabel,
  onClose,
  onView,
  onEdit,
  onDelete,
  viewLabel = 'Переглянути',
  openHref,
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
        {viewLabel}
      </MenuItem>
      {row && openHref && (
        <MenuItem component={RouterLink} to={openHref(row)} onClick={() => onClose(false)}>
          <ListItemIcon>
            <OpenInFullOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Відкрити повну картку
        </MenuItem>
      )}
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
