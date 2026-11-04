import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

interface Props {
  title: string;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

/** «Видалити завдання?»: the only centered dialog of the task pages. */
export function TaskDeleteDialog({ title, busy, onCancel, onConfirm }: Props) {
  return (
    <Dialog open onClose={busy ? undefined : onCancel} aria-labelledby="task-delete-title">
      <DialogTitle id="task-delete-title">Видалити завдання?</DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          «{title}» зникне разом із кроками та історією. Це не можна скасувати.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={busy}>
          Скасувати
        </Button>
        <Button color="error" variant="contained" onClick={onConfirm} disabled={busy}>
          Видалити
        </Button>
      </DialogActions>
    </Dialog>
  );
}
