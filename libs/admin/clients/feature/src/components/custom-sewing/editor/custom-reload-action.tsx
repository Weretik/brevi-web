import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useState } from 'react';

export function CustomReloadAction({
  disabled,
  onReload,
}: {
  disabled: boolean;
  onReload: () => Promise<boolean>;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  return (
    <>
      <Button disabled={disabled || pending} onClick={() => setOpen(true)}>
        Оновити конфігурацію із сервера
      </Button>
      <Dialog
        open={open}
        onClose={() => {
          if (!pending) setOpen(false);
        }}
        aria-labelledby="custom-reload-title"
      >
        <DialogTitle id="custom-reload-title">Оновити конфігурацію?</DialogTitle>
        <DialogContent>
          Введення буде замінене збереженим станом сервера. Ціни збережених версій залишаться
          незмінними.
        </DialogContent>
        <DialogActions>
          <Button disabled={pending} onClick={() => setOpen(false)}>
            Залишити введення
          </Button>
          <Button
            disabled={disabled || pending}
            onClick={() => {
              setPending(true);
              void onReload()
                .then((accepted) => {
                  if (accepted) setOpen(false);
                })
                .finally(() => setPending(false));
            }}
          >
            Прийняти дані сервера
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
