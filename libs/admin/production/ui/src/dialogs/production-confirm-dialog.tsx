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
  title: string;
  text: string;
  confirmLabel: string;
  danger?: boolean;
  busy: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ProductionConfirmDialog({
  open,
  title,
  text,
  confirmLabel,
  danger = false,
  busy,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={busy ? undefined : onClose}
      aria-labelledby="production-confirm-title"
    >
      <DialogTitle id="production-confirm-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={busy}>
          Скасувати
        </Button>
        <Button
          variant="contained"
          color={danger ? 'error' : 'primary'}
          onClick={onConfirm}
          disabled={busy}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
