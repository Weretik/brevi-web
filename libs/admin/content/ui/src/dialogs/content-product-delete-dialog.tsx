import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface Props {
  /** Name of the product whose page is deleted; null keeps the dialog closed. */
  name: string | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ContentProductDeleteDialog({ name, deleting, onClose, onConfirm }: Props) {
  return (
    <Dialog open={name !== null} onClose={onClose} aria-labelledby="content-product-delete-title">
      <DialogTitle id="content-product-delete-title">Видалити сторінку сайту?</DialogTitle>
      <DialogContent>
        Тексти та SEO товару «{name}» обома мовами буде видалено, і сайт перестане його показувати.
        Сам товар у «Товари» залишиться. Якщо товар треба лише приховати, вимкніть «Показувати на
        сайті».
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
