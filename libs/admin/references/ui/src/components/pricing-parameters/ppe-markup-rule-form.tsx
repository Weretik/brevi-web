import { ppeMarkupRuleTextLimits } from '@admin/references/model';
import { InputAdornment, Stack, TextField } from '@mui/material';

import { ReferenceFormSection } from '../reference-editor/reference-form-section';

import type {
  PpeMarkupRuleField,
  PpeMarkupRuleFieldErrors,
  PpeMarkupRuleFormValues,
} from '@admin/references/model';

interface Props {
  creating: boolean;
  values: PpeMarkupRuleFormValues;
  errors: PpeMarkupRuleFieldErrors;
  onChange: (field: PpeMarkupRuleField, value: string) => void;
}

const markups: { field: PpeMarkupRuleField; label: string }[] = [
  { field: 'retailMarkup', label: 'Роздріб' },
  { field: 'wholesaleMarkup', label: 'Опт' },
  { field: 'largeWholesaleMarkup', label: 'Великий опт' },
];

export function PpeMarkupRuleForm({ creating, values, errors, onChange }: Props) {
  const text = (field: 'priceNote' | 'appliesTo', label: string) => (
    <TextField
      label={label}
      value={values[field]}
      onChange={(event) => onChange(field, event.target.value)}
      error={Boolean(errors[field])}
      helperText={errors[field]}
      multiline
      minRows={2}
      slotProps={{ htmlInput: { maxLength: ppeMarkupRuleTextLimits[field] } }}
      fullWidth
    />
  );

  return (
    <Stack sx={{ gap: 2 }}>
      <ReferenceFormSection title="Правило">
        <TextField
          label="Назва правила"
          placeholder="Рукавички"
          value={values.name}
          onChange={(event) => onChange('name', event.target.value)}
          disabled={!creating}
          error={Boolean(errors.name)}
          helperText={
            errors.name ??
            (creating
              ? 'Після збереження назва не змінюється.'
              : 'Товари ЗІЗ шукають націнку за цією назвою, тому вона не змінюється.')
          }
          slotProps={{ htmlInput: { maxLength: ppeMarkupRuleTextLimits.name } }}
          fullWidth
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Націнка на ціну постачальника">
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
          {markups.map(({ field, label }) => (
            <TextField
              key={field}
              label={label}
              value={values[field]}
              onChange={(event) => onChange(field, event.target.value)}
              error={Boolean(errors[field])}
              helperText={errors[field]}
              slotProps={{
                htmlInput: { inputMode: 'decimal' },
                input: { endAdornment: <InputAdornment position="end">%</InputAdornment> },
              }}
              fullWidth
            />
          ))}
        </Stack>
      </ReferenceFormSection>
      <ReferenceFormSection title="Для прайсу">
        {text('priceNote', 'Примітка для прайсу')}
        {text('appliesTo', 'До яких товарів належить')}
      </ReferenceFormSection>
    </Stack>
  );
}
