import {
  reminderChatName,
  reminderOrganizationLabels,
  reminderOrganizations,
  reminderTaskTitleMaxLength,
} from '@admin/reminders/model';
import { FormControlLabel, MenuItem, Stack, Switch, TextField } from '@mui/material';

import { ReminderScheduleFields } from './reminder-schedule-fields';

import type {
  ReminderChat,
  ReminderTaskFormErrors,
  ReminderTaskFormValues,
} from '@admin/reminders/model';

interface Props {
  values: ReminderTaskFormValues;
  errors: ReminderTaskFormErrors;
  chats: readonly ReminderChat[];
  disabled: boolean;
  onChange: (patch: Partial<ReminderTaskFormValues>) => void;
}

export function ReminderTaskForm({ values, errors, chats, disabled, onChange }: Props) {
  return (
    <Stack spacing={2}>
      <TextField
        autoFocus
        label="Назва задачі"
        value={values.title}
        disabled={disabled}
        error={!!errors.title}
        helperText={errors.title}
        slotProps={{ htmlInput: { maxLength: reminderTaskTitleMaxLength } }}
        onChange={(event) => onChange({ title: event.target.value })}
      />
      <TextField
        select
        label="Організація"
        value={values.organization}
        disabled={disabled}
        helperText={
          values.organization === 'none'
            ? 'Особисті задачі приходять без назви організації.'
            : undefined
        }
        onChange={(event) =>
          onChange({ organization: event.target.value as ReminderTaskFormValues['organization'] })
        }
      >
        {reminderOrganizations.map((code) => (
          <MenuItem key={code} value={code}>
            {reminderOrganizationLabels[code]}
          </MenuItem>
        ))}
      </TextField>
      <ReminderScheduleFields
        values={values}
        errors={errors}
        disabled={disabled}
        onChange={onChange}
      />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          select
          fullWidth
          label="Чат Telegram"
          value={values.chatId ?? ''}
          disabled={disabled}
          helperText={chats.length ? undefined : 'Спершу додайте бота в чат і підтвердьте його.'}
          onChange={(event) =>
            onChange({ chatId: event.target.value === '' ? null : Number(event.target.value) })
          }
        >
          <MenuItem value="">Не призначено</MenuItem>
          {chats.map((chat) => (
            <MenuItem key={chat.id} value={chat.id}>
              {reminderChatName(chat)}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          type="date"
          label="Активна з"
          value={values.activeFrom}
          disabled={disabled}
          helperText="Порожньо — з сьогодні"
          slotProps={{ inputLabel: { shrink: true } }}
          onChange={(event) => onChange({ activeFrom: event.target.value })}
        />
      </Stack>
      <FormControlLabel
        control={
          <Switch
            checked={values.isEnabled}
            disabled={disabled}
            onChange={(event) => onChange({ isEnabled: event.target.checked })}
          />
        }
        label="Надсилати нагадування"
      />
    </Stack>
  );
}
