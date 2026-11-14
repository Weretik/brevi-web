import { Alert, Button } from '@mui/material';

interface Props {
  /** Load error of the list; offers «Повторити». */
  error: string | null;
  loading: boolean;
  onRetry: () => void;
  /** Result of the last save or delete; text starting with «Не вдалося» is shown as an error. */
  actionMessage: string | null;
  onCloseActionMessage: () => void;
}

/** Load error and last action result above a «Цех» reference list. */
export function ReferenceListAlerts({
  error,
  loading,
  onRetry,
  actionMessage,
  onCloseActionMessage,
}: Props) {
  return (
    <>
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <Button disabled={loading} onClick={onRetry}>
              Повторити
            </Button>
          }
        >
          {error}
        </Alert>
      )}
      {actionMessage && (
        <Alert
          severity={actionMessage.startsWith('Не вдалося') ? 'error' : 'success'}
          onClose={onCloseActionMessage}
          sx={{ mb: 2 }}
        >
          {actionMessage}
        </Alert>
      )}
    </>
  );
}
