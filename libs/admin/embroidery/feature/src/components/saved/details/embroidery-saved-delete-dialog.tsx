import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface Props {
  open: boolean;
  /** «ВШ-12» of the calculation. */
  number: string | undefined;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Confirms deleting a saved embroidery calculation. */
export function EmbroiderySavedDeleteDialog({ open, number, onCancel, onConfirm }: Props) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Видалити {number}?</DialogTitle>
      <DialogContent>
        <DialogContentText>Розрахунок зникне зі списку назавжди.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Скасувати</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>
          Видалити
        </Button>
      </DialogActions>
    </Dialog>
  );
}
