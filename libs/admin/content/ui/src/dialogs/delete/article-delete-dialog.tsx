import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface Props {
  /** Title of the article to delete; null keeps the dialog closed. */
  title: string | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ArticleDeleteDialog({ title, deleting, onClose, onConfirm }: Props) {
  return (
    <Dialog open={title !== null} onClose={onClose} aria-labelledby="article-delete-title">
      <DialogTitle id="article-delete-title">Видалити статтю?</DialogTitle>
      <DialogContent>
        Статтю «{title}» з її текстами та SEO обома мовами буде видалено. Фото залишаться в
        бібліотеці «Фото». Якщо статтю треба лише приховати, вимкніть «Показувати на сайті».
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
