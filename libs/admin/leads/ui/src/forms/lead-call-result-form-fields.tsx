import { leadCallResultNameMaxLength, leadOutcomeLabels, leadOutcomes } from '@admin/leads/model';
import { FormControlLabel, MenuItem, Stack, Switch, TextField } from '@mui/material';

import type {
  LeadCallResultFormErrors,
  LeadCallResultFormValues,
  LeadOutcome,
} from '@admin/leads/model';

interface Props {
  values: LeadCallResultFormValues;
  errors: LeadCallResultFormErrors;
  showErrors: boolean;
  disabled: boolean;
  onChange: (values: LeadCallResultFormValues) => void;
}

const outcomeHelp: Record<LeadOutcome, string> = {
  Retry: 'Лід повернеться в чергу сам через вказану кількість днів.',
  Callback: 'Менеджер обирає дату, з’являється задача «Подзвонити».',
  Talking: 'Йде розмова з відповідальним, потрібна дата наступного контакту.',
  Offer: 'Надсилаємо пропозицію, потрібна дата наступного контакту.',
  Client: 'Лід став клієнтом, робота з ним завершена.',
  Closed: 'Відмова або нецільовий лід, робота з ним завершена.',
};

/** Fields of the «Результат дзвінка» side panel. */
export function LeadCallResultFormFields({
  values,
  errors,
  showErrors,
  disabled,
  onChange,
}: Props) {
  const error = (field: keyof LeadCallResultFormErrors) => (showErrors ? errors[field] : undefined);
  return (
    <Stack sx={{ gap: 2 }}>
      <TextField
        label="Назва"
        value={values.name}
        disabled={disabled}
        required
        autoFocus
        error={Boolean(error('name'))}
        helperText={error('name')}
        onChange={(event) => onChange({ ...values, name: event.target.value })}
        slotProps={{ htmlInput: { maxLength: leadCallResultNameMaxLength } }}
      />
      <TextField
        select
        label="Що робить"
        value={values.outcome}
        disabled={disabled}
        helperText={outcomeHelp[values.outcome]}
        onChange={(event) => onChange({ ...values, outcome: event.target.value as LeadOutcome })}
      >
        {leadOutcomes.map((outcome) => (
          <MenuItem key={outcome} value={outcome}>
            {leadOutcomeLabels[outcome]}
          </MenuItem>
        ))}
      </TextField>
      {values.outcome === 'Retry' && (
        <TextField
          label="Повторити через, днів"
          type="number"
          value={values.retryDays}
          disabled={disabled}
          error={Boolean(error('retryDays'))}
          helperText={error('retryDays')}
          onChange={(event) => onChange({ ...values, retryDays: event.target.value })}
          slotProps={{ htmlInput: { min: 1, max: 60 } }}
        />
      )}
      <TextField
        label="Порядок"
        type="number"
        value={values.position}
        disabled={disabled}
        error={Boolean(error('position'))}
        helperText={error('position') ?? 'Менше число — кнопка раніше в «Мій день».'}
        onChange={(event) => onChange({ ...values, position: event.target.value })}
        slotProps={{ htmlInput: { min: 0, max: 1000 } }}
      />
      <FormControlLabel
        control={
          <Switch
            checked={values.isActive}
            disabled={disabled}
            onChange={(event) => onChange({ ...values, isActive: event.target.checked })}
          />
        }
        label="Показувати менеджерам"
      />
    </Stack>
  );
}
