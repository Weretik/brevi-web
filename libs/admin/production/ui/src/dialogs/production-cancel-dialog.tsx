import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';

interface Props {
  open: boolean;
  number: number;
  reason: string;
  error: string | null;
  busy: boolean;
  onChange: (reason: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

/** «Скасувати завдання» asks why; the reason stays on the card and in the history. */
export function ProductionCancelDialog({
  open,
  number,
  reason,
  error,
  busy,
  onChange,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
      onClose={busy ? undefined : onClose}
      aria-labelledby="production-cancel-title"
    >
      <DialogTitle id="production-cancel-title">Скасувати завдання № {number}?</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Цех перестане над ним працювати. Повернути в роботу може адміністратор.
        </DialogContentText>
        <TextField
          label="Причина"
          required
          fullWidth
          multiline
          minRows={2}
          autoFocus
          value={reason}
          error={Boolean(error)}
          helperText={error}
          disabled={busy}
          onChange={(event) => onChange(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={busy}>
          Не скасовувати
        </Button>
        <Button variant="contained" color="error" onClick={onConfirm} disabled={busy}>
          Скасувати завдання
        </Button>
      </DialogActions>
    </Dialog>
  );
}
