import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface ConfirmActionDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  destructive?: boolean;
  submitting: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmActionDialog({
  confirmLabel,
  description,
  destructive = false,
  error,
  onCancel,
  onConfirm,
  open,
  submitting,
  title,
}: ConfirmActionDialogProps) {
  return (
    <Dialog fullWidth maxWidth="xs" onClose={submitting ? undefined : onCancel} open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : null}
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button disabled={submitting} onClick={onCancel}>
          Скасувати
        </Button>
        <Button
          color={destructive ? 'error' : 'primary'}
          disabled={submitting}
          onClick={onConfirm}
          variant="contained"
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
