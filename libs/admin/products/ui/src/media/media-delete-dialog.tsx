import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

import type { ProductMedia } from '@admin/products/model';

interface MediaDeleteDialogProps {
  item: ProductMedia | null;
  deleting: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
  onExited: () => void;
}

export function MediaDeleteDialog({
  item,
  deleting,
  error,
  onClose,
  onConfirm,
  onExited,
}: MediaDeleteDialogProps) {
  return (
    <Dialog
      open={Boolean(item)}
      onClose={deleting ? undefined : onClose}
      aria-labelledby="media-delete-title"
      slotProps={{ transition: { onExited } }}
    >
      <DialogTitle id="media-delete-title">Підтвердження видалення</DialogTitle>
      <DialogContent>
        <Typography>
          Видалити фото «{item?.originalFileName}»? Цю дію не можна скасувати.
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button disabled={deleting} onClick={onClose}>
          {error ? 'Закрити' : 'Скасувати'}
        </Button>
        {!error && (
          <Button color="error" variant="contained" disabled={deleting} onClick={onConfirm}>
            {deleting ? 'Видалення…' : 'Видалити'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
