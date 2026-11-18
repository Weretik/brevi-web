import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface Props {
  /** Name of the category to delete; null keeps the dialog closed. */
  name: string | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function SiteCategoryDeleteDialog({ name, deleting, onClose, onConfirm }: Props) {
  return (
    <Dialog open={name !== null} onClose={onClose} aria-labelledby="site-category-delete-title">
      <DialogTitle id="site-category-delete-title">Видалити розділ сайту?</DialogTitle>
      <DialogContent>
        Розділ «{name}» з його текстами та SEO обома мовами буде видалено. Товари залишаться, але
        перестануть належати до цього розділу. Якщо розділ треба лише приховати, вимкніть
        «Показувати на сайті».
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
