import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface Props {
  /** Name of the line to delete; null keeps the dialog closed. */
  name: string | null;
  deleting: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

/** Confirms deleting one fabric, material or operation of a sewing model. */
export function SewingLineDeleteDialog({ name, deleting, error, onClose, onConfirm }: Props) {
  return (
    <Dialog
      open={name !== null}
      onClose={deleting ? undefined : onClose}
      aria-labelledby="sewing-line-delete-title"
    >
      <DialogTitle id="sewing-line-delete-title">Видалити «{name}»?</DialogTitle>
      <DialogContent>
        <DialogContentText>Ціни моделі перерахуються одразу.</DialogContentText>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button disabled={deleting} onClick={onClose}>
          Скасувати
        </Button>
        <Button disabled={deleting} color="error" onClick={onConfirm}>
          Видалити
        </Button>
      </DialogActions>
    </Dialog>
  );
}
