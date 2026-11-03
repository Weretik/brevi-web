import {
  productSectionTextLimits,
  productSectionTypeLabels,
  productSectionTypes,
} from '@admin/references/model';
import { FormControlLabel, MenuItem, Stack, Switch, TextField } from '@mui/material';

import { ReferenceFormSection } from '../reference-editor/reference-form-section';

import type {
  ProductSectionField,
  ProductSectionFieldErrors,
  ProductSectionFormValues,
  ProductSectionType,
} from '@admin/references/model';

interface Props {
  values: ProductSectionFormValues;
  errors: ProductSectionFieldErrors;
  onChange: <Field extends ProductSectionField>(
    field: Field,
    value: ProductSectionFormValues[Field],
  ) => void;
}

export function ProductSectionForm({ values, errors, onChange }: Props) {
  return (
    <Stack sx={{ gap: 2 }}>
      <ReferenceFormSection title="Розділ">
        <TextField
          select
          label="Тип товару"
          value={values.type}
          onChange={(event) => onChange('type', event.target.value as ProductSectionType)}
          fullWidth
        >
          {productSectionTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {productSectionTypeLabels[type]}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Назва розділу"
          placeholder="Одяг ЛІТО"
          value={values.name}
          onChange={(event) => onChange('name', event.target.value)}
          error={Boolean(errors.name)}
          helperText={errors.name ?? 'Згодом із розділів будуть категорії на сайті.'}
          slotProps={{ htmlInput: { maxLength: productSectionTextLimits.name } }}
          fullWidth
        />
        <FormControlLabel
          control={
            <Switch
              checked={values.isActive}
              onChange={(event) => onChange('isActive', event.target.checked)}
            />
          }
          label="Активний"
        />
        <TextField
          label="Коментар"
          value={values.comment}
          onChange={(event) => onChange('comment', event.target.value)}
          error={Boolean(errors.comment)}
          helperText={errors.comment}
          multiline
          minRows={2}
          slotProps={{ htmlInput: { maxLength: productSectionTextLimits.comment } }}
          fullWidth
        />
      </ReferenceFormSection>
    </Stack>
  );
}
