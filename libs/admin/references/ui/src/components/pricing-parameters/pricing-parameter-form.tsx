import { isPercentUnit, pricingParameterTextLimits } from '@admin/references/model';
import { Autocomplete, InputAdornment, Stack, TextField } from '@mui/material';

import { ReferenceFormSection } from '../reference-editor/reference-form-section';

import type {
  PricingParameterField,
  PricingParameterFieldErrors,
  PricingParameterFormValues,
} from '@admin/references/model';

interface Props {
  creating: boolean;
  values: PricingParameterFormValues;
  errors: PricingParameterFieldErrors;
  /** Existing groups and units, offered as suggestions. */
  groups: string[];
  units: string[];
  onChange: (field: PricingParameterField, value: string) => void;
}

export function PricingParameterForm({ creating, values, errors, groups, units, onChange }: Props) {
  const percent = isPercentUnit(values.unit);
  const suggested = (
    field: 'group' | 'unit',
    label: string,
    options: string[],
    helperText?: string,
  ) => (
    <Autocomplete
      freeSolo
      options={options}
      value={values[field]}
      onInputChange={(_, value) => onChange(field, value)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={Boolean(errors[field])}
          helperText={errors[field] ?? helperText}
        />
      )}
      fullWidth
    />
  );

  return (
    <Stack sx={{ gap: 2 }}>
      <ReferenceFormSection title="Основні дані">
        <TextField
          label="Код"
          placeholder="SALARY_SEAMSTRESS"
          value={values.code}
          onChange={(event) => onChange('code', event.target.value.toUpperCase())}
          disabled={!creating}
          error={Boolean(errors.code)}
          helperText={
            errors.code ??
            (creating
              ? 'Латиницею, без пробілів. Після збереження код не змінюється.'
              : 'За кодом ціни знаходять це число, тому він не змінюється.')
          }
          slotProps={{ htmlInput: { maxLength: pricingParameterTextLimits.code } }}
          fullWidth
        />
        {suggested('group', 'Група', groups)}
        <TextField
          label="Назва"
          value={values.name}
          onChange={(event) => onChange('name', event.target.value)}
          error={Boolean(errors.name)}
          helperText={errors.name}
          slotProps={{ htmlInput: { maxLength: pricingParameterTextLimits.name } }}
          fullWidth
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Значення">
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
          <TextField
            label="Значення"
            value={values.isCalculated ? '' : values.value}
            onChange={(event) => onChange('value', event.target.value)}
            disabled={values.isCalculated}
            error={Boolean(errors.value)}
            helperText={
              errors.value ??
              (values.isCalculated
                ? 'Brevi рахує сам: зарплата / (дні × хвилини зміни).'
                : percent
                  ? 'У відсотках: 25 означає 25 %.'
                  : undefined)
            }
            slotProps={{
              htmlInput: { inputMode: 'decimal' },
              input: percent
                ? { endAdornment: <InputAdornment position="end">%</InputAdornment> }
                : undefined,
            }}
            fullWidth
          />
          {suggested('unit', 'Одиниця виміру', units)}
        </Stack>
      </ReferenceFormSection>
      <ReferenceFormSection title="Нотатки">
        <TextField
          label="Коментар"
          value={values.comment}
          onChange={(event) => onChange('comment', event.target.value)}
          error={Boolean(errors.comment)}
          helperText={errors.comment}
          multiline
          minRows={2}
          slotProps={{ htmlInput: { maxLength: pricingParameterTextLimits.comment } }}
          fullWidth
        />
      </ReferenceFormSection>
    </Stack>
  );
}
