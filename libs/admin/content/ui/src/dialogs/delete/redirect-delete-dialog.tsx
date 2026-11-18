import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface Props {
  /** Old address of the redirect to delete; null keeps the dialog closed. */
  fromPath: string | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function RedirectDeleteDialog({ fromPath, deleting, onClose, onConfirm }: Props) {
  return (
    <Dialog open={fromPath !== null} onClose={onClose} aria-labelledby="redirect-delete-title">
      <DialogTitle id="redirect-delete-title">Видалити переадресацію?</DialogTitle>
      <DialogContent>
        Адреса {fromPath} більше не вестиме на новий сайт: відвідувачі та пошукові системи побачать
        «Сторінку не знайдено».
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
