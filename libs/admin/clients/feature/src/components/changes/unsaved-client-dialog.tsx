import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import type { Blocker } from 'react-router-dom';

export function UnsavedClientDialog({ blocker }: { blocker: Blocker }) {
  return (
    <Dialog
      open={blocker.state === 'blocked'}
      onClose={() => blocker.reset?.()}
      aria-labelledby="unsaved-client-title"
    >
      <DialogTitle id="unsaved-client-title">Незбережені зміни</DialogTitle>
      <DialogContent>Залишити сторінку й відхилити введені зміни?</DialogContent>
      <DialogActions>
        <Button onClick={() => blocker.reset?.()}>Продовжити редагування</Button>
        <Button color="warning" onClick={() => blocker.proceed?.()}>
          Відхилити й вийти
        </Button>
      </DialogActions>
    </Dialog>
  );
}
