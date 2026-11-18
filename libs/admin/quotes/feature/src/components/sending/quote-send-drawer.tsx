import { quoteEditorPath } from '@admin/quotes/model';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Box, Button, CircularProgress } from '@mui/material';

import { QuoteSendLetterFields } from './quote-send-letter-fields';
import { useMailboxConnect } from '../../hooks/sending/use-mailbox-connect';
import { useQuoteSend } from '../../hooks/sending/use-quote-send';

import type { Quote, QuoteActor } from '@admin/quotes/model';

interface Props {
  quote: Quote;
  actor: QuoteActor;
  onClose: () => void;
  onSent: (quote: Quote) => void;
}

/**
 * «Надіслати КП»: the letter goes from the signed-in person's own Gmail with the PDF of the saved КП attached.
 * Without a connected Gmail the panel offers to connect it first.
 */
export function QuoteSendDrawer({ quote, actor, onClose, onSent }: Props) {
  const send = useQuoteSend(quote, onSent);
  const mailbox = useMailboxConnect(quoteEditorPath(quote.kind, quote.id));
  const { draft } = send;
  const ready = Boolean(draft?.gmailConfigured && draft.fromEmail);

  return (
    <ReferenceEditorDrawer
      titleId="quote-send-title"
      title="Надіслати КП"
      description={`КП ${quote.number}. Лист піде з вашого Gmail, PDF додається автоматично.`}
      formId="quote-send-form"
      paperWidth={560}
      readOnly={false}
      saving={send.sending}
      saveDisabled={!ready}
      submitLabel={send.sending ? 'Надсилаємо…' : 'Надіслати'}
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={send.send}
    >
      {send.loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress aria-label="Готуємо лист" />
        </Box>
      )}
      {send.loadError && <Alert severity="error">{send.loadError}</Alert>}
      {send.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {send.error}
        </Alert>
      )}
      {mailbox.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {mailbox.error}
        </Alert>
      )}
      {draft && !draft.gmailConfigured && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Надсилання ще не ввімкнено: директору потрібно додати ключі Google. Поки що можна
          сформувати PDF і надіслати його вручну.
        </Alert>
      )}
      {draft?.gmailConfigured && !draft.fromEmail && (
        <Alert
          severity="warning"
          sx={{ mb: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              disabled={mailbox.busy || actor.userId === null}
              onClick={() => {
                if (actor.userId !== null) void mailbox.connect(actor.userId);
              }}
            >
              Підключити мій Gmail
            </Button>
          }
        >
          Ваш Gmail ще не підключено. Ви увійдете в Google і дозволите надсилання листів.
        </Alert>
      )}
      {draft && <QuoteSendLetterFields send={send} draft={draft} />}
    </ReferenceEditorDrawer>
  );
}
