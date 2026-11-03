import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface Props {
  /** Null keeps the dialog closed. */
  title: string | null;
  text: string;
  deleting: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

/** Confirmation before deleting photos or a folder. */
export function MediaConfirmDeleteDialog({
  title,
  text,
  deleting,
  error,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Dialog
      open={title !== null}
      onClose={() => {
        if (!deleting) onClose();
      }}
      aria-labelledby="media-delete-title"
    >
      <DialogTitle id="media-delete-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={deleting}>
          Скасувати
        </Button>
        <Button variant="contained" color="error" onClick={onConfirm} disabled={deleting}>
          {deleting && <CircularProgress color="inherit" size={18} sx={{ mr: 1 }} />}
          Видалити
        </Button>
      </DialogActions>
    </Dialog>
  );
}
