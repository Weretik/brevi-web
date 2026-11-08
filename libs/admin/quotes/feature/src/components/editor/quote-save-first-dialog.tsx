import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface Props {
  saving: boolean;
  onCancel: () => void;
  onSave: () => void;
}

/** Asked before the PDF or sending when the КП is new or has unsaved changes. */
export function QuoteSaveFirstDialog({ saving, onCancel, onSave }: Props) {
  return (
    <Dialog open onClose={saving ? undefined : onCancel} aria-labelledby="quote-save-first-title">
      <DialogTitle id="quote-save-first-title">Щоб продовжити, збережіть КП</DialogTitle>
      <DialogContent>
        <DialogContentText>
          PDF формується зі збереженого КП. Після збереження КП залишиться відкритим.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={saving}>
          Скасувати
        </Button>
        <Button variant="contained" onClick={onSave} disabled={saving}>
          {saving ? 'Зберігаємо…' : 'Зберегти'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
