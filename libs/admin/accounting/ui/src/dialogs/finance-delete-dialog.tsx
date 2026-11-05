import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface Props {
  open: boolean;
  title: string;
  text: string;
  deleting: boolean;
  /** Text of the confirm button; «Видалити» by default («Анулювати» for movements). */
  confirmLabel?: string;
  /** «primary» for a confirmation that removes nothing. */
  confirmColor?: 'error' | 'primary';
  onClose: () => void;
  onConfirm: () => void;
}

/** Confirmation before deleting an account or a category, or cancelling a movement. */
export function FinanceDeleteDialog({
  open,
  title,
  text,
  deleting,
  confirmLabel = 'Видалити',
  confirmColor = 'error',
  onClose,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="finance-delete-title">
      <DialogTitle id="finance-delete-title">{title}</DialogTitle>
      <DialogContent>{text}</DialogContent>
      <DialogActions>
        <Button disabled={deleting} onClick={onClose}>
          Скасувати
        </Button>
        <Button disabled={deleting} color={confirmColor} variant="contained" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
