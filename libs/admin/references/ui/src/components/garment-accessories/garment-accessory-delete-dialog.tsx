import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface Props {
  ids: readonly number[] | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function GarmentAccessoryDeleteDialog({ ids, deleting, onClose, onConfirm }: Props) {
  return (
    <Dialog open={Boolean(ids)} onClose={onClose} aria-labelledby="garment-accessory-delete-title">
      <DialogTitle id="garment-accessory-delete-title">Підтвердження видалення</DialogTitle>
      <DialogContent>Видалити {ids?.length ?? 0} вибраних записів?</DialogContent>
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
