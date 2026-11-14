import { fabricColorNameMaxLength } from '@admin/references/model';
import { FormControlLabel, Stack, Switch, TextField } from '@mui/material';

import { ReferenceFormSection } from '../../components/reference-editor/reference-form-section';

import type {
  FabricColorField,
  FabricColorFieldErrors,
  FabricColorFormValues,
} from '@admin/references/model';

interface Props {
  values: FabricColorFormValues;
  errors: FabricColorFieldErrors;
  onChange: <Field extends FabricColorField>(
    field: Field,
    value: FabricColorFormValues[Field],
  ) => void;
}

export function FabricColorForm({ values, errors, onChange }: Props) {
  return (
    <Stack sx={{ gap: 2 }}>
      <ReferenceFormSection title="Колір">
        <TextField
          label="Назва кольору"
          placeholder="Темно-синій кол.1076"
          value={values.name}
          onChange={(event) => onChange('name', event.target.value)}
          error={Boolean(errors.name)}
          helperText={
            errors.name ??
            'Цех обирає колір позиції та складу лише з цього списку. Збережені позиції залишають свою назву.'
          }
          slotProps={{ htmlInput: { maxLength: fabricColorNameMaxLength } }}
          fullWidth
        />
        <FormControlLabel
          control={
            <Switch
              checked={values.isActive}
              onChange={(event) => onChange('isActive', event.target.checked)}
            />
          }
          label="Активний: показувати у виборі кольору"
        />
      </ReferenceFormSection>
    </Stack>
  );
}
