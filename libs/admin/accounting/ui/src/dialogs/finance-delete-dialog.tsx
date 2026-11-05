import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface Props {
  open: boolean;
  title: string;
  text: string;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/** Confirmation before deleting an account or a category. */
export function FinanceDeleteDialog({ open, title, text, deleting, onClose, onConfirm }: Props) {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="finance-delete-title">
      <DialogTitle id="finance-delete-title">{title}</DialogTitle>
      <DialogContent>{text}</DialogContent>
      <DialogActions>
        <Button disabled={deleting} onClick={onClose}>
          Скасувати
        </Button>
        <Button disabled={deleting} color="error" variant="contained" onClick={onConfirm}>
          Видалити
        </Button>
      </DialogActions>
    </Dialog>
  );
}
