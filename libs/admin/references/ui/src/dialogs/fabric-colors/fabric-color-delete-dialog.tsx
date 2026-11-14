import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface Props {
  ids: readonly number[] | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function FabricColorDeleteDialog({ ids, deleting, onClose, onConfirm }: Props) {
  return (
    <Dialog open={Boolean(ids)} onClose={onClose} aria-labelledby="fabric-color-delete-title">
      <DialogTitle id="fabric-color-delete-title">Підтвердження видалення</DialogTitle>
      <DialogContent>
        Видалити {ids?.length ?? 0} вибраних кольорів? Збережені позиції й склад залишать свою назву
        кольору. Якщо колір лише тимчасово не потрібен, краще вимкніть його.
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
