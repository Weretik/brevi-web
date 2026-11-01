import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface Props {
  open: boolean;
  title: string;
  text: string;
  confirmLabel: string;
  busy: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/** Destructive confirmation with a contained error button. */
export function ReminderConfirmDialog({
  open,
  title,
  text,
  confirmLabel,
  busy,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={busy ? undefined : onClose}
      aria-labelledby="reminder-confirm-title"
    >
      <DialogTitle id="reminder-confirm-title">{title}</DialogTitle>
      <DialogContent>{text}</DialogContent>
      <DialogActions>
        <Button disabled={busy} onClick={onClose}>
          Скасувати
        </Button>
        <Button variant="contained" color="error" disabled={busy} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
