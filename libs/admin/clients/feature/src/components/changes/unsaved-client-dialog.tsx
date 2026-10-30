import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import type { Blocker } from 'react-router-dom';

export function UnsavedClientDialog({
  blocker,
  locked = false,
}: {
  blocker: Blocker;
  locked?: boolean;
}) {
  return (
    <Dialog
      open={blocker.state === 'blocked'}
      onClose={() => blocker.reset?.()}
      aria-labelledby="unsaved-client-title"
    >
      <DialogTitle id="unsaved-client-title">
        {locked ? 'Незавершена дія' : 'Незбережені зміни'}
      </DialogTitle>
      <DialogContent>
        {locked
          ? 'Завершіть або скасуйте поточну дію. Якщо результат запису невідомий, перевірте його повтором запиту.'
          : 'Залишити сторінку й відхилити введені зміни?'}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => blocker.reset?.()}>Продовжити редагування</Button>
        <Button
          color="warning"
          disabled={locked}
          onClick={() => {
            if (!locked) blocker.proceed?.();
          }}
        >
          Відхилити й вийти
        </Button>
      </DialogActions>
    </Dialog>
  );
}
