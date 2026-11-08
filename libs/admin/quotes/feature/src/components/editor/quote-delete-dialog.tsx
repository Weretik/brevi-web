import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import type { useQuoteDelete } from '../../hooks/lifecycle/use-quote-delete';

interface Props {
  flow: ReturnType<typeof useQuoteDelete>;
}

/** «Видалити КП …?»: shown while a КП waits for the confirmation; the server's refusal stays here. */
export function QuoteDeleteDialog({ flow }: Props) {
  const { target, deleting, error } = flow;
  if (!target) return null;
  return (
    <Dialog open onClose={deleting ? undefined : flow.cancel} aria-labelledby="quote-delete-title">
      <DialogTitle id="quote-delete-title">Видалити КП {target.number}?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          КП буде видалено назавжди разом з усіма позиціями та історією.
        </DialogContentText>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={flow.cancel} disabled={deleting}>
          Скасувати
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => void flow.confirm()}
          disabled={deleting}
        >
          Видалити
        </Button>
      </DialogActions>
    </Dialog>
  );
}
