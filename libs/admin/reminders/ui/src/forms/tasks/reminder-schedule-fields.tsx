import {
  reminderDueRuleLabels,
  reminderDueRules,
  reminderPeriodicities,
  reminderPeriodicityLabels,
} from '@admin/reminders/model';
import { MenuItem, Stack, TextField } from '@mui/material';

import type { ReminderTaskFormErrors, ReminderTaskFormValues } from '@admin/reminders/model';

interface Props {
  values: ReminderTaskFormValues;
  errors: ReminderTaskFormErrors;
  disabled: boolean;
  onChange: (patch: Partial<ReminderTaskFormValues>) => void;
}

const numberInput = { inputMode: 'numeric', pattern: '[0-9]*' } as const;

export function ReminderScheduleFields({ values, errors, disabled, onChange }: Props) {
  const showDay = values.dueRule !== 'lastWorkingDayOfMonth';
  const showOffset = values.dueRule !== 'daysAfterPeriodEnd';
  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          select
          fullWidth
          label="Періодичність"
          value={values.periodicity}
          disabled={disabled}
          onChange={(event) =>
            onChange({ periodicity: event.target.value as ReminderTaskFormValues['periodicity'] })
          }
        >
          {reminderPeriodicities.map((code) => (
            <MenuItem key={code} value={code}>
              {reminderPeriodicityLabels[code]}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          fullWidth
          label="Термін"
          value={values.dueRule}
          disabled={disabled}
          onChange={(event) =>
            onChange({ dueRule: event.target.value as ReminderTaskFormValues['dueRule'] })
          }
        >
          {reminderDueRules.map((code) => (
            <MenuItem key={code} value={code}>
              {reminderDueRuleLabels[code]}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        {showDay && (
          <TextField
            fullWidth
            label={values.dueRule === 'dayOfMonth' ? 'Число місяця' : 'Днів після кінця періоду'}
            value={values.day}
            disabled={disabled}
            error={!!errors.day}
            helperText={errors.day}
            slotProps={{ htmlInput: numberInput }}
            onChange={(event) => onChange({ day: event.target.value })}
          />
        )}
        {showOffset && (
          <TextField
            fullWidth
            label="Зсув, місяців"
            value={values.monthOffset}
            disabled={disabled}
            error={!!errors.monthOffset}
            helperText={errors.monthOffset ?? '0 — останній місяць періоду, 1 — наступний'}
            slotProps={{ htmlInput: numberInput }}
            onChange={(event) => onChange({ monthOffset: event.target.value })}
          />
        )}
        <TextField
          fullWidth
          label="Нагадувати за, днів"
          value={values.leadDays}
          disabled={disabled}
          error={!!errors.leadDays}
          helperText={errors.leadDays}
          slotProps={{ htmlInput: numberInput }}
          onChange={(event) => onChange({ leadDays: event.target.value })}
        />
      </Stack>
    </Stack>
  );
}
