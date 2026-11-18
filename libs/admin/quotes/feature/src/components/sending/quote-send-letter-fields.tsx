import { quoteLetterBodyMax, quoteSubjectMax } from '@admin/quotes/model';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import { Box, MenuItem, Stack, TextField, Typography } from '@mui/material';

import type { useQuoteSend } from '../../hooks/sending/use-quote-send';

type QuoteSend = ReturnType<typeof useQuoteSend>;

interface Props {
  send: QuoteSend;
  draft: NonNullable<QuoteSend['draft']>;
}

/** The letter: sender, template, recipients, subject, text and the attached PDF. */
export function QuoteSendLetterFields({ send, draft }: Props) {
  const { form, errors } = send;
  return (
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
  );
}
