import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface Props {
  ids: readonly number[] | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ProductSectionDeleteDialog({ ids, deleting, onClose, onConfirm }: Props) {
  return (
    <Dialog open={Boolean(ids)} onClose={onClose} aria-labelledby="product-section-delete-title">
      <DialogTitle id="product-section-delete-title">Підтвердження видалення</DialogTitle>
      <DialogContent>
        Видалити {ids?.length ?? 0} вибраних розділів? Якщо розділ лише тимчасово не потрібен, краще
        вимкніть його.
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
