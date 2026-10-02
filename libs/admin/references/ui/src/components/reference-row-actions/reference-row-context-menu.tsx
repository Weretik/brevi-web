import { Menu, MenuItem } from '@mui/material';

interface Props<Row> {
  anchorPosition: { left: number; top: number } | null;
  row: Row | null;
  rowName: string;
  onClose: () => void;
  onView: (row: Row) => void;
  onEdit: (row: Row) => void;
  onDelete: (row: Row) => void;
}

export function ReferenceRowContextMenu<Row>({
  anchorPosition,
  row,
  rowName,
  onClose,
  onView,
  onEdit,
  onDelete,
}: Props<Row>) {
  function run(action: (selectedRow: Row) => void) {
    if (row) action(row);
    onClose();
  }

  return (
    <Menu
      anchorPosition={anchorPosition ?? undefined}
      anchorReference="anchorPosition"
      open={row !== null}
      onClose={onClose}
      slotProps={{ list: { 'aria-label': row ? `Дії: ${rowName}` : 'Дії запису' } }}
    >
      <MenuItem onClick={() => run(onView)}>Перегляд</MenuItem>
      <MenuItem onClick={() => run(onEdit)}>Змінити</MenuItem>
      <MenuItem onClick={() => run(onDelete)}>Видалити</MenuItem>
    </Menu>
  );
}
