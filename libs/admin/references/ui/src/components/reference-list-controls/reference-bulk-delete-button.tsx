import { usePageRights } from '@admin/shared/ui';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { Button } from '@mui/material';

interface Props {
  selectedCount: number;
  disabled: boolean;
  onDelete: () => void;
}

/** Bulk delete next to the primary action; rendered only while rows are selected. */
export function ReferenceBulkDeleteButton({ selectedCount, disabled, onDelete }: Props) {
  const { canDelete } = usePageRights();
  if (!selectedCount || !canDelete) return null;
  return (
    <Button
      variant="outlined"
      color="error"
      startIcon={<DeleteOutlineIcon />}
      disabled={disabled}
      aria-label={`Видалити вибрані (${selectedCount})`}
      onClick={onDelete}
      sx={{ '&:not(.Mui-disabled)': { color: 'error.main', bgcolor: 'error.light' } }}
    >
      Видалити{' '}
      <span style={{ fontFamily: 'var(--admin-font-mono)', marginLeft: 4 }}>{selectedCount}</span>
    </Button>
  );
}
