import { Alert, Button, Stack } from '@mui/material';

import type { GmailNotice } from '../../hooks/sending/use-gmail-return-notice';

interface Props {
  saveError: { message: string; stale: boolean } | null;
  onReload: () => void;
  gmail: { notice: GmailNotice | null; dismiss: () => void };
  mailboxError: string | null;
  restored: boolean;
  onRestoredClose: () => void;
}

/** Messages above the sections: save failures, Gmail results and changes kept over the Google sign-in. */
export function QuoteSettingsNotices({
  saveError,
  onReload,
  gmail,
  mailboxError,
  restored,
  onRestoredClose,
}: Props) {
  if (!saveError && !gmail.notice && !mailboxError && !restored) return null;
  return (
    <Stack sx={{ gap: 1.5, mb: 2 }}>
      {saveError && (
        <Alert
          severity="error"
          action={
            saveError.stale ? (
              <Button color="inherit" onClick={onReload}>
                Оновити
              </Button>
            ) : undefined
          }
        >
          {saveError.message}
        </Alert>
      )}
      {gmail.notice && (
        <Alert severity={gmail.notice.severity} onClose={gmail.dismiss}>
          {gmail.notice.text}
        </Alert>
      )}
      {mailboxError && <Alert severity="error">{mailboxError}</Alert>}
      {restored && (
        <Alert severity="info" onClose={onRestoredClose}>
          Повернули ваші незбережені зміни. Не забудьте натиснути «Зберегти».
        </Alert>
      )}
    </Stack>
  );
}
