import { Alert, Button } from '@mui/material';

import type { useQuoteIntroductionEditor } from '../../hooks/introduction/use-quote-introduction-editor';
import type { useQuoteLifecycle } from '../../hooks/lifecycle/use-quote-lifecycle';
import type { useRouteNotice } from '../../hooks/lifecycle/use-route-notice';
import type { useGmailReturnNotice } from '../../hooks/sending/use-gmail-return-notice';

export interface QuoteIntroductionNotice {
  severity: 'success' | 'warning';
  text: string;
}

interface Props {
  lifecycle: ReturnType<typeof useQuoteLifecycle>;
  routeNotice: ReturnType<typeof useRouteNotice>;
  editor: Pick<ReturnType<typeof useQuoteIntroductionEditor>, 'saveError' | 'reload'>;
  gmail: ReturnType<typeof useGmailReturnNotice>;
  notice: QuoteIntroductionNotice | null;
  onCloseNotice: () => void;
}

/** The messages above the introduction quote: action and save errors, the route, Gmail and page notices. */
export function QuoteIntroductionNotices({
  lifecycle,
  routeNotice,
  editor,
  gmail,
  notice,
  onCloseNotice,
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
      {editor.saveError && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            editor.saveError.stale ? (
              <Button color="inherit" onClick={() => void editor.reload()}>
                Оновити
              </Button>
            ) : undefined
          }
        >
          {editor.saveError.message}
        </Alert>
      )}
      {gmail.notice && (
        <Alert severity={gmail.notice.severity} sx={{ mb: 2 }} onClose={gmail.dismiss}>
          {gmail.notice.text}
        </Alert>
      )}
      {notice && (
        <Alert severity={notice.severity} sx={{ mb: 2 }} onClose={onCloseNotice}>
          {notice.text}
        </Alert>
      )}
    </>
  );
}
