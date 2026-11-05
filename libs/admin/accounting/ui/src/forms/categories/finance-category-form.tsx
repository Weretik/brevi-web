import {
  categoryDirectionLabels,
  categoryDirections,
  financeCategoryLimits,
} from '@admin/accounting/model';
import { ReferenceFormSection } from '@admin/references/ui';
import { MenuItem, Stack, TextField } from '@mui/material';

import type {
  CategoryDirection,
  FinanceCategory,
  FinanceCategoryField,
  FinanceCategoryFieldErrors,
  FinanceCategoryFormValues,
} from '@admin/accounting/model';

interface Props {
  values: FinanceCategoryFormValues;
  errors: FinanceCategoryFieldErrors;
  /** Roots of the chosen direction a subcategory can go under. */
  parents: FinanceCategory[];
  /** Direction and level are fixed once the category exists. */
  creating: boolean;
  onChange: <Field extends FinanceCategoryField>(
    field: Field,
    value: FinanceCategoryFormValues[Field],
  ) => void;
}

export function FinanceCategoryForm({ values, errors, parents, creating, onChange }: Props) {
  return (
    <Stack sx={{ gap: 2 }}>
      <ReferenceFormSection title="Категорія">
        <TextField
          select
          label="Тип"
          value={values.direction}
          disabled={!creating}
          onChange={(event) => {
            onChange('direction', event.target.value as CategoryDirection);
            onChange('parentId', '');
          }}
          fullWidth
        >
          {categoryDirections.map((direction) => (
            <MenuItem key={direction} value={direction}>
              {categoryDirectionLabels[direction]}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Входить у"
          value={values.parentId}
          disabled={!creating}
          onChange={(event) => onChange('parentId', event.target.value)}
          helperText={
            creating ? 'Залиште «Коренева категорія», щоб створити верхній рівень.' : undefined
          }
          fullWidth
        >
          <MenuItem value="">Коренева категорія</MenuItem>
          {parents.map((parent) => (
            <MenuItem key={parent.id} value={parent.id}>
              {parent.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Назва"
          placeholder="Тканини"
          value={values.name}
          onChange={(event) => onChange('name', event.target.value)}
          error={Boolean(errors.name)}
          helperText={errors.name}
          slotProps={{ htmlInput: { maxLength: financeCategoryLimits.name } }}
          fullWidth
        />
        <TextField
          label="Примітка"
          value={values.note}
          onChange={(event) => onChange('note', event.target.value)}
          error={Boolean(errors.note)}
          helperText={errors.note}
          multiline
          minRows={2}
          slotProps={{ htmlInput: { maxLength: financeCategoryLimits.note } }}
          fullWidth
        />
      </ReferenceFormSection>
    </Stack>
  );
}
