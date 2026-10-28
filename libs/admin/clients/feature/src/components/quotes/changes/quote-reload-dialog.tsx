import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

export function QuoteReloadDialog({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onClose={onCancel} aria-labelledby="reload-quote-title">
      <DialogTitle id="reload-quote-title">Відхилити локальні зміни?</DialogTitle>
      <DialogContent>
        Оновлення замінить введення поточною серверною версією. До підтвердження введення
        зберігається.
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Продовжити редагування</Button>
        <Button onClick={onConfirm}>Відхилити й оновити</Button>
      </DialogActions>
    </Dialog>
  );
}
