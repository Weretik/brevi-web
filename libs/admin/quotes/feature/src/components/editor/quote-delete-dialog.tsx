import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface Props {
  number: string;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

/** «Видалити чернетку?» confirmation. */
export function QuoteDeleteDialog({ number, deleting, onCancel, onConfirm }: Props) {
  return (
    <Dialog open onClose={deleting ? undefined : onCancel} aria-labelledby="quote-delete-title">
      <DialogTitle id="quote-delete-title">Видалити КП {number}?</DialogTitle>
      <DialogContent>
        <DialogContentText>Чернетку буде видалено разом з усіма позиціями.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={deleting}>
          Скасувати
        </Button>
        <Button variant="contained" color="error" onClick={onConfirm} disabled={deleting}>
          Видалити
        </Button>
      </DialogActions>
    </Dialog>
  );
}
