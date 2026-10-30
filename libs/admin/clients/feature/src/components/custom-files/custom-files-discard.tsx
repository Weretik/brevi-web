import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useState } from 'react';

export function CustomFilesDiscard({
  disabled,
  onDiscard,
}: {
  disabled: boolean;
  onDiscard: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button disabled={disabled} onClick={() => setOpen(true)}>
        Скасувати зміни прив’язок
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="discard-file-links-title">
        <DialogTitle id="discard-file-links-title">Скасувати зміни файлів?</DialogTitle>
        <DialogContent>
          Незбережені ознаки та нові прив’язки буде скасовано. Збережені й історичні файли
          залишаться.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Залишити зміни</Button>
          <Button
            disabled={disabled}
            onClick={() => {
              onDiscard();
              setOpen(false);
            }}
          >
            Підтвердити скасування
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
