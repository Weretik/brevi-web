import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface Props {
  /** Name of the picture to remove; null keeps the dialog closed. */
  name: string | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/** Removing a picture from the site page; the photo itself stays in «Фото». */
export function SiteGalleryDeleteDialog({ name, deleting, onClose, onConfirm }: Props) {
  return (
    <Dialog open={name !== null} onClose={onClose} aria-labelledby="site-gallery-delete-title">
      <DialogTitle id="site-gallery-delete-title">Прибрати з сайту?</DialogTitle>
      <DialogContent>
        «{name}» зникне зі сторінки сайту. Саме фото лишиться в бібліотеці «Фото».
      </DialogContent>
      <DialogActions>
        <Button disabled={deleting} onClick={onClose}>
          Скасувати
        </Button>
        <Button disabled={deleting} color="error" onClick={onConfirm}>
          Прибрати
        </Button>
      </DialogActions>
    </Dialog>
  );
}
