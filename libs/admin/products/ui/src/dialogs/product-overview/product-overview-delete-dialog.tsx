import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface Props {
  ids: readonly number[] | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ProductOverviewDeleteDialog({ ids, deleting, onClose, onConfirm }: Props) {
  return (
    <Dialog open={Boolean(ids)} onClose={onClose} aria-labelledby="product-overview-delete-title">
      <DialogTitle id="product-overview-delete-title">Підтвердження видалення</DialogTitle>
      <DialogContent>
        Видалити {ids?.length ?? 0} вибраних товарів разом зі складом і цінами? Якщо товар лише
        тимчасово не продається, краще вимкніть його.
      </DialogContent>
      <DialogActions>
        <Button disabled={deleting} onClick={onClose}>
          Скасувати
        </Button>
        <Button disabled={deleting || !ids?.length} color="error" onClick={onConfirm}>
          Видалити
        </Button>
      </DialogActions>
    </Dialog>
  );
}
