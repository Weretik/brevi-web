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
  navigationBlocked: boolean;
  busy: boolean;
  creatingArticle: boolean;
  onStay: () => void;
  onDiscardAndContinue: () => void;
}

export function UnsavedChangesDialog({
  open,
  navigationBlocked,
  busy,
  creatingArticle,
  onStay,
  onDiscardAndContinue,
}: Props) {
  return (
    <Dialog open={open} onClose={onStay} aria-labelledby="sewing-unsaved-title">
      <DialogTitle id="sewing-unsaved-title">Незбережені зміни</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {navigationBlocked
            ? busy
              ? 'Збереження ще триває. Перейти зі сторінки та залишити його завершуватися?'
              : 'Вийти зі сторінки та відкинути незбережений склад?'
            : creatingArticle
              ? 'Щоб створити артикул, спершу відкиньте незбережені зміни складу.'
              : 'Відкинути незбережені зміни та перейти до іншого складу?'}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onStay}>Залишитися</Button>
        <Button color="error" onClick={onDiscardAndContinue}>
          {navigationBlocked ? 'Вийти без збереження' : 'Відкинути зміни й продовжити'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
