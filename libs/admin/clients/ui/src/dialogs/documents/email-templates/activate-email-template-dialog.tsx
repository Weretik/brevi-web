import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

export function ActivateEmailTemplateDialog({
  open,
  versionNumber,
  disabled,
  onClose,
  onConfirm,
}: {
  open: boolean;
  versionNumber: number | null;
  disabled: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="activate-email-template-title">
      <DialogTitle id="activate-email-template-title">Активувати версію шаблону?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Версія {versionNumber} стане активною для нових дій. Збережені посилання та попередні
          листи не зміняться.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button disabled={disabled} onClick={onClose}>
          Скасувати
        </Button>
        <Button variant="contained" disabled={disabled} onClick={onConfirm}>
          Підтвердити активацію
        </Button>
      </DialogActions>
    </Dialog>
  );
}
