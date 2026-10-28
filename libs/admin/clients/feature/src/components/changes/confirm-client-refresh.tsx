import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

export interface ConfirmClientRefreshProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}
export function ConfirmClientRefresh({ open, onCancel, onConfirm }: ConfirmClientRefreshProps) {
  return (
    <Dialog open={open} onClose={onCancel} aria-labelledby="refresh-client-title">
      <DialogTitle id="refresh-client-title">Відхилити зміни й оновити клієнта?</DialogTitle>
      <DialogContent>Незбережений ввід буде замінено актуальними даними із сервера.</DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Продовжити редагування</Button>
        <Button color="warning" onClick={onConfirm}>
          Відхилити та оновити
        </Button>
      </DialogActions>
    </Dialog>
  );
}
