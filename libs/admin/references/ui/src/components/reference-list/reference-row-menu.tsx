import { usePageRights } from '@admin/shared/ui';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Divider, Link, ListItemIcon, Menu, MenuItem } from '@mui/material';

import type { PageAction } from '@admin/shared/ui';

interface MenuRow {
  /** Numeric ids in references; text ids (uuid) in other modules. */
  id: number | string;
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
  onDelete: (id: Row['id']) => void;
  /** «Переглянути» by default; e.g. «Швидкий перегляд» when the row also has a full page. */
  viewLabel?: string;
  /** Adds «Відкрити повну картку» that opens this page. */
  openHref?: (row: Row) => string;
  /** «Видалити» by default; e.g. «В архів» when the row is archived instead. */
  deleteLabel?: string;
  /** The «Права доступу» action the last item needs: delete by default, edit when it archives or voids. */
  deleteRight?: PageAction;
}

/** Row actions of «Цех» reference grids: view, open the full page (optional), edit, delete; edit and delete only with those rights. */
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
  deleteLabel = 'Видалити',
  deleteRight = 'delete',
}: Props<Row>) {
  const { can, canEdit } = usePageRights();
  const canDelete = can(deleteRight);
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
        <MenuItem
          // MUI Link renders the router-aware link registered in the theme.
          component={Link}
          href={openHref(row)}
          underline="none"
          color="inherit"
          onClick={() => onClose(false)}
        >
          <ListItemIcon>
            <OpenInFullOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Відкрити повну картку
        </MenuItem>
      )}
      {canEdit && (
        <MenuItem onClick={() => run(onEdit)}>
          <ListItemIcon>
            <EditOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Редагувати
        </MenuItem>
      )}
      {canDelete && <Divider />}
      {canDelete && (
        <MenuItem sx={{ color: 'error.main' }} onClick={() => run((value) => onDelete(value.id))}>
          <ListItemIcon sx={{ color: 'inherit' }}>
            <DeleteOutlineIcon fontSize="small" />
          </ListItemIcon>
          {deleteLabel}
        </MenuItem>
      )}
    </Menu>
  );
}
