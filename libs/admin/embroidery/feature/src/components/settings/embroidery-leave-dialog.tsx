import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import type { Blocker } from 'react-router-dom';

/** «Вийти без збереження?» while «Налаштування» has unsaved changes. */
export function EmbroideryLeaveDialog({ blocker }: { blocker: Blocker }) {
  return (
    <Dialog open={blocker.state === 'blocked'} onClose={() => blocker.reset?.()}>
      <DialogTitle>Вийти без збереження?</DialogTitle>
      <DialogContent>Зміни в «Налаштуваннях» не збережені й пропадуть.</DialogContent>
      <DialogActions>
        <Button onClick={() => blocker.reset?.()}>Залишитись</Button>
        <Button color="error" variant="contained" onClick={() => blocker.proceed?.()}>
          Вийти
        </Button>
      </DialogActions>
    </Dialog>
  );
}
