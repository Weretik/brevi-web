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
  title: string;
  text: string;
  confirmLabel: string;
  reason: string;
  error: string | null;
  busy: boolean;
  onChange: (reason: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

/** A step that needs a reason, such as «Сторно»; the reason stays in the history. */
export function ProductionReasonDialog({
  open,
  title,
  text,
  confirmLabel,
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
      aria-labelledby="production-reason-title"
    >
      <DialogTitle id="production-reason-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>{text}</DialogContentText>
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
          Не треба
        </Button>
        <Button variant="contained" color="error" onClick={onConfirm} disabled={busy}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
