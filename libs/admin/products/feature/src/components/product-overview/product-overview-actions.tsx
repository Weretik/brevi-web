import { ReferenceBulkDeleteButton } from '@admin/references/ui';
import { usePageRights } from '@admin/shared/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface Props {
  sewing: boolean;
  selectedCount: number;
  deleteDisabled: boolean;
  onDelete: () => void;
}

/** «Товари» header buttons: bulk delete and «Додати модель» / «Додати ЗІЗ». */
export function ProductOverviewActions({ sewing, selectedCount, deleteDisabled, onDelete }: Props) {
  const { canCreate } = usePageRights();
  return (
    <>
      <ReferenceBulkDeleteButton
        selectedCount={selectedCount}
        disabled={deleteDisabled}
        onDelete={onDelete}
      />
      {canCreate && (
        <Button
          variant="contained"
          startIcon={<AddOutlinedIcon />}
          component={RouterLink}
          to={sewing ? '/references/products/new/sewing' : '/references/products/new/ppe'}
        >
          {sewing ? 'Додати модель' : 'Додати ЗІЗ'}
        </Button>
      )}
    </>
  );
}
