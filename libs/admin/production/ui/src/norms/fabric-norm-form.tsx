import { fabricNormFieldLabels, fabricNormTotal, formatMeters } from '@admin/production/model';
import { ReferenceFormSection } from '@admin/references/ui';
import { InputAdornment, TextField, Typography } from '@mui/material';

import type {
  FabricNormErrors,
  FabricNormField,
  FabricNormFormValues,
} from '@admin/production/model';

interface Props {
  values: FabricNormFormValues;
  errors: FabricNormErrors;
  onChange: (field: FabricNormField, value: string) => void;
}

const groups: { title: string; fields: FabricNormField[]; hint: string }[] = [
  { title: 'Один колір', fields: ['oneColor'], hint: 'Виріб з однієї тканини.' },
  {
    title: 'Два кольори',
    fields: ['twoColorsMain', 'twoColorsAdditional'],
    hint: 'Основна тканина і вставки.',
  },
  {
    title: 'Три кольори',
    fields: ['threeColorsMain', 'threeColorsAdditional1', 'threeColorsAdditional2'],
    hint: 'Основна тканина і дві додаткові.',
  },
];

/** Six metre inputs in three groups; the sum of a split norm is shown while typing. */
export function FabricNormForm({ values, errors, onChange }: Props) {
  return (
    <>
      {groups.map((group) => {
        const total = group.fields.length > 1 ? fabricNormTotal(values, group.fields) : null;
        return (
          <ReferenceFormSection key={group.title} title={group.title}>
            <Typography variant="body2" color="text.secondary">
              {group.hint}
            </Typography>
            {group.fields.map((field) => (
              <TextField
                key={field}
                label={fabricNormFieldLabels[field]}
                value={values[field]}
                onChange={(event) => onChange(field, event.target.value)}
                error={Boolean(errors[field])}
                helperText={errors[field]}
                slotProps={{
                  htmlInput: { inputMode: 'decimal' },
                  input: { endAdornment: <InputAdornment position="end">м</InputAdornment> },
                }}
                fullWidth
              />
            ))}
            {total !== null && (
              <Typography variant="body2" sx={{ fontFamily: 'var(--admin-font-mono)' }}>
                Разом: {formatMeters(total)}
              </Typography>
            )}
          </ReferenceFormSection>
        );
      })}
    </>
  );
}
