import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface Props {
  open: boolean;
  itemName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

/** The last fabric of an item cannot stay alone: removing it removes the whole item, so it is confirmed. */
export function QuoteRemoveLastFabricDialog({ open, itemName, onCancel, onConfirm }: Props) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Прибрати позицію?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Це остання тканина позиції «{itemName}». Разом з нею позиція зникне з КП.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Скасувати</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>
          Прибрати позицію
        </Button>
      </DialogActions>
    </Dialog>
  );
}
