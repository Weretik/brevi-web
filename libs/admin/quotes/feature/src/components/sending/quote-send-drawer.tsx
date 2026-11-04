import { quoteEditorPath, quoteLetterBodyMax, quoteSubjectMax } from '@admin/quotes/model';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

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
  const { draft, form, errors } = send;
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
      {draft && (
        <Stack sx={{ gap: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Від кого
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {draft.fromName}
              {draft.fromEmail ? ` <${draft.fromEmail}>` : ''}
            </Typography>
          </Box>
          <TextField
            select
            size="small"
            label="Лист"
            value={send.letterIndex}
            onChange={(event) => send.chooseLetter(Number(event.target.value))}
          >
            {draft.letters.map((letter, index) => (
              <MenuItem key={`${letter.name}-${index}`} value={index}>
                {letter.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            label="Кому"
            placeholder="client@company.ua"
            value={form.to}
            error={Boolean(errors.to)}
            helperText={errors.to ?? 'Кілька адрес — через кому.'}
            onChange={(event) => send.change({ to: event.target.value })}
            slotProps={{ htmlInput: { maxLength: 2000, inputMode: 'email' } }}
          />
          <TextField
            size="small"
            label="Тема"
            value={form.subject}
            error={Boolean(errors.subject)}
            helperText={errors.subject}
            onChange={(event) => send.change({ subject: event.target.value })}
            slotProps={{ htmlInput: { maxLength: quoteSubjectMax } }}
          />
          <TextField
            multiline
            minRows={8}
            size="small"
            label="Текст листа"
            value={form.body}
            error={Boolean(errors.body)}
            helperText={errors.body}
            onChange={(event) => send.change({ body: event.target.value })}
            slotProps={{ htmlInput: { maxLength: quoteLetterBodyMax } }}
          />
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1, color: 'text.secondary' }}>
            <AttachFileOutlinedIcon fontSize="small" />
            <Typography variant="body2">{draft.fileName}</Typography>
          </Stack>
        </Stack>
      )}
    </ReferenceEditorDrawer>
  );
}
