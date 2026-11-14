import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface Props {
  ids: readonly number[] | null;
  deleting: boolean;
  /** What is deleted, e.g. «параметрів». */
  what: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function PricingDeleteDialog({ ids, deleting, what, onClose, onConfirm }: Props) {
  return (
    <Dialog open={Boolean(ids)} onClose={onClose} aria-labelledby="pricing-delete-title">
      <DialogTitle id="pricing-delete-title">Підтвердження видалення</DialogTitle>
      <DialogContent>
        Видалити {ids?.length ?? 0} вибраних {what}? Ціни, які на них спираються, перестануть
        рахуватися, доки значення не повернуть.
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
