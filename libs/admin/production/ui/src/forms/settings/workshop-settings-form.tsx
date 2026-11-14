import {
  Alert,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

import type {
  WorkshopSettingsErrors,
  WorkshopSettingsFormValues,
  WorkshopTelegramChat,
} from '@admin/production/model';

interface Props {
  values: WorkshopSettingsFormValues;
  chats: WorkshopTelegramChat[];
  botConfigured: boolean;
  errors: WorkshopSettingsErrors;
  disabled: boolean;
  onChange: (values: WorkshopSettingsFormValues) => void;
}

/** Where the Brevi bot posts new orders: one of its groups and, in a group with topics, the topic. */
export function WorkshopSettingsForm({
  values,
  chats,
  botConfigured,
  errors,
  disabled,
  onChange,
}: Props) {
  const known = chats.some((chat) => String(chat.chatId) === values.chatId);
  return (
    <Stack sx={{ gap: 2 }}>
      {!botConfigured && (
        <Alert severity="warning">
          На сервері немає токена бота Brevi, тому повідомлення не надсилатимуться.
        </Alert>
      )}
      {botConfigured && chats.length === 0 && (
        <Alert severity="warning">
          Бот Brevi ще не бачить жодної групи. Додайте його в групу цеху, і вона з’явиться тут.
        </Alert>
      )}
      <TextField
        select
        label="Група цеху"
        value={values.chatId}
        error={Boolean(errors.chatId)}
        helperText={errors.chatId ?? 'Групи, де є бот Brevi (той самий, що для «Нагадувань»).'}
        disabled={disabled}
        onChange={(event) => onChange({ ...values, chatId: event.target.value })}
      >
        <MenuItem value="">Не обрано</MenuItem>
        {!known && values.chatId && (
          <MenuItem value={values.chatId}>Група {values.chatId}</MenuItem>
        )}
        {chats.map((chat) => (
          <MenuItem key={chat.chatId} value={String(chat.chatId)}>
            {chat.title}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Номер теми"
        value={values.threadId}
        error={Boolean(errors.threadId)}
        helperText={
          errors.threadId ??
          'Лише для групи з темами: число з посилання на тему. Порожньо — у загальний чат.'
        }
        disabled={disabled}
        slotProps={{ htmlInput: { inputMode: 'numeric' } }}
        onChange={(event) => onChange({ ...values, threadId: event.target.value })}
      />
      <FormControlLabel
        control={
          <Switch
            checked={values.telegramEnabled}
            disabled={disabled}
            onChange={(event) => onChange({ ...values, telegramEnabled: event.target.checked })}
          />
        }
        label="Надсилати нові завдання в групу"
      />
      <Typography variant="body2" color="text.secondary">
        Після «Передати в цех» і додавання файлів менеджер натискає «Надіслати в цех». Кожне
        завдання надсилається один раз.
      </Typography>
    </Stack>
  );
}
