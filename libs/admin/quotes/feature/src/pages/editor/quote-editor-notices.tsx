import { Alert, Button } from '@mui/material';

import type { useQuoteLifecycle } from '../../hooks/lifecycle/use-quote-lifecycle';
import type { useRouteNotice } from '../../hooks/lifecycle/use-route-notice';
import type { useGmailReturnNotice } from '../../hooks/sending/use-gmail-return-notice';

interface Props {
  lifecycle: ReturnType<typeof useQuoteLifecycle>;
  routeNotice: ReturnType<typeof useRouteNotice>;
  saveError: { message: string; stale: boolean } | null;
  onReload: () => void;
  gmail: ReturnType<typeof useGmailReturnNotice>;
  sentNotice: string | null;
  onSentNoticeClose: () => void;
}

/** The notices above the КП editor: errors, Gmail return, sent and copy notices. */
export function QuoteEditorNotices({
  lifecycle,
  routeNotice,
  saveError,
  onReload,
  gmail,
  sentNotice,
  onSentNoticeClose,
}: Props) {
  return (
    <>
      {lifecycle.error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={lifecycle.clearError}>
          {lifecycle.error}
        </Alert>
      )}
      {routeNotice.notice && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={routeNotice.dismiss}>
          {routeNotice.notice}
        </Alert>
      )}
      {saveError && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
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
        <Alert severity={gmail.notice.severity} sx={{ mb: 2 }} onClose={gmail.dismiss}>
          {gmail.notice.text}
        </Alert>
      )}
      {sentNotice && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={onSentNoticeClose}>
          {sentNotice}
        </Alert>
      )}
    </>
  );
}
