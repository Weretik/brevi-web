import {
  embroideryBasisLabels,
  embroideryExpenseBases,
  embroideryExpenseModeLabels,
  embroideryExpenseModes,
} from '@admin/embroidery/model';
import { FormControlLabel, MenuItem, Stack, Switch, TextField } from '@mui/material';

import { EmbroideryNumberField } from '../embroidery-number-field';

import type {
  EmbroideryExpenseBasis,
  EmbroideryExpenseDraft,
  EmbroideryExpenseMode,
} from '@admin/embroidery/model';

interface Props {
  formId: string;
  expense: EmbroideryExpenseDraft;
  errors: Readonly<Record<string, string>>;
  onChange: (patch: Partial<EmbroideryExpenseDraft>) => void;
  onSubmit: () => void;
}

/** The fields of one extra cost in its side panel. */
export function EmbroideryExpenseForm({ formId, expense, errors, onChange, onSubmit }: Props) {
  return (
    <Stack
      component="form"
      id={formId}
      noValidate
      sx={{ gap: 2 }}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <TextField
        label="Назва"
        autoFocus
        value={expense.name}
        error={Boolean(errors['name'])}
        helperText={errors['name']}
        onChange={(event) => onChange({ name: event.target.value })}
      />
      <TextField
        select
        label="Рахується"
        value={expense.basis}
        onChange={(event) => onChange({ basis: event.target.value as EmbroideryExpenseBasis })}
      >
        {embroideryExpenseBases.map((basis) => (
          <MenuItem key={basis} value={basis}>
            {embroideryBasisLabels[basis]}
          </MenuItem>
        ))}
      </TextField>
      <EmbroideryNumberField
        label="Ставка"
        unit="грн"
        value={expense.rate}
        error={errors['rate']}
        helperText="Порожньо — ставку ще не знаємо: ціна буде «Орієнтовна». 0 — безкоштовно."
        onChange={(rate) => onChange({ rate })}
      />
      <TextField
        select
        label="Де діє"
        value={expense.mode}
        onChange={(event) => onChange({ mode: event.target.value as EmbroideryExpenseMode })}
      >
        {embroideryExpenseModes.map((mode) => (
          <MenuItem key={mode} value={mode}>
            {embroideryExpenseModeLabels[mode]}
          </MenuItem>
        ))}
      </TextField>
      <FormControlLabel
        control={
          <Switch
            checked={expense.enabled}
            onChange={(event) => onChange({ enabled: event.target.checked })}
          />
        }
        label="Відмічено на початку розрахунку"
      />
    </Stack>
  );
}
