import { useDeleteProductMutation } from '@admin/products/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useState } from 'react';

interface Props {
  id: number | null;
  name: string;
  onClose: () => void;
  onDeleted: () => void;
}

export function ProductDeleteDialog({ id, name, onClose, onDeleted }: Props) {
  const [deleteProduct, deleteState] = useDeleteProductMutation();
  const saving = deleteState.isLoading;
  const [error, setError] = useState<string | null>(null);
  function close() {
    setError(null);
    onClose();
  }
  async function confirm() {
    if (id === null) return;
    setError(null);
    try {
      await deleteProduct(id).unwrap();
      onDeleted();
    } catch (cause) {
      setError(adminApiErrorMessage(cause, 'Не вдалося видалити товар.'));
    }
  }
  return (
    <Dialog
      open={id !== null}
      onClose={saving ? undefined : close}
      aria-labelledby="product-delete-title"
    >
      <DialogTitle id="product-delete-title">Видалити товар?</DialogTitle>
      <DialogContent>
        Ви дійсно хочете видалити «{name}»?
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={close} disabled={saving}>
          Скасувати
        </Button>
        <Button color="error" variant="contained" onClick={() => void confirm()} disabled={saving}>
          Видалити
        </Button>
      </DialogActions>
    </Dialog>
  );
}
