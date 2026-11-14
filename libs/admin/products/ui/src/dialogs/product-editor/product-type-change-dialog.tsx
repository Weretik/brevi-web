import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface Props {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ProductTypeChangeDialog({ open, onCancel, onConfirm }: Props) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Змінити тип товару?</DialogTitle>
      <DialogContent>Дані поточного типу буде втрачено. Підтвердьте зміну типу.</DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Скасувати</Button>
        <Button color="warning" onClick={onConfirm}>
          Змінити тип
        </Button>
      </DialogActions>
    </Dialog>
  );
}
