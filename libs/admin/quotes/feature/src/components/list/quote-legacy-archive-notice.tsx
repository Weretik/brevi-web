import {
  useGetQuoteLegacyArchiveQuery,
  usePurgeQuoteLegacyArchiveMutation,
} from '@admin/quotes/data-access';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useState } from 'react';

const messageOf = (error: unknown, fallback: string) =>
  (error as { message?: string } | undefined)?.message ?? fallback;

/**
 * The КП that were in the old archive (crm R-23): the Director sees how many are left and deletes them for good.
 * КП with a production order are not deleted; they come back to the list.
 */
export function QuoteLegacyArchiveNotice() {
  const legacy = useGetQuoteLegacyArchiveQuery();
  const [purge, purging] = usePurgeQuoteLegacyArchiveMutation();
  const [confirming, setConfirming] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const count = legacy.data?.count ?? 0;

  if (result)
    return (
      <Alert severity="success" sx={{ mb: 1.5 }} onClose={() => setResult(null)}>
        {result}
      </Alert>
    );
  if (count === 0) return null;

  return (
    <>
      <Alert
        severity="warning"
        sx={{ mb: 1.5 }}
        action={
          <Button color="inherit" onClick={() => setConfirming(true)}>
            Видалити назавжди
          </Button>
        }
      >
        КП, які були в архіві: {count}. Архіву більше немає, їх треба видалити.
      </Alert>
      {confirming && (
        <Dialog
          open
          onClose={purging.isLoading ? undefined : () => setConfirming(false)}
          aria-labelledby="quote-legacy-purge-title"
        >
          <DialogTitle id="quote-legacy-purge-title">Видалити КП з архіву: {count}?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Їх буде видалено назавжди. КП, за якими є виробниче завдання, не видаляються й
              повернуться до списку.
            </DialogContentText>
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirming(false)} disabled={purging.isLoading}>
              Скасувати
            </Button>
            <Button
              variant="contained"
              color="error"
              disabled={purging.isLoading}
              onClick={async () => {
                setError(null);
                try {
                  const done = await purge().unwrap();
                  setConfirming(false);
                  setResult(
                    done.returned > 0
                      ? `Видалено КП: ${done.deleted}. Повернуто до списку (є виробниче завдання): ${done.returned}.`
                      : `Видалено КП: ${done.deleted}.`,
                  );
                } catch (cause) {
                  setError(messageOf(cause, 'Не вдалося видалити КП з архіву.'));
                }
              }}
            >
              Видалити
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
