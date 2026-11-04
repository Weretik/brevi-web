import {
  WORKSHOP_EMPLOYEE_NAME_MAX_LENGTH,
  WORKSHOP_EMPLOYEE_POSITION_MAX_LENGTH,
  workshopPositions,
} from '@admin/production/model';
import { ReferenceFormSection } from '@admin/references/ui';
import { Autocomplete, TextField } from '@mui/material';

import type {
  WorkshopEmployeeDraft,
  WorkshopEmployeeErrors,
  WorkshopEmployeeField,
} from '@admin/production/model';

interface Props {
  values: WorkshopEmployeeDraft;
  errors: WorkshopEmployeeErrors;
  onChange: (field: WorkshopEmployeeField, value: string) => void;
}

export function WorkshopEmployeeForm({ values, errors, onChange }: Props) {
  return (
    <ReferenceFormSection title="Працівник">
      <TextField
        label="ПІБ"
        placeholder="Прізвище Ім'я"
        value={values.fullName}
        onChange={(event) => onChange('fullName', event.target.value)}
        error={Boolean(errors.fullName)}
        helperText={errors.fullName ?? 'Так ім’я буде в журналі робіт і зарплаті.'}
        slotProps={{ htmlInput: { maxLength: WORKSHOP_EMPLOYEE_NAME_MAX_LENGTH } }}
        autoFocus
        fullWidth
      />
      <Autocomplete
        freeSolo
        options={workshopPositions}
        inputValue={values.position}
        onInputChange={(_event, value) => onChange('position', value)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Посада"
            error={Boolean(errors.position)}
            helperText={errors.position ?? 'Оберіть зі списку або напишіть свою.'}
            slotProps={{
              ...params.slotProps,
              htmlInput: {
                ...params.slotProps.htmlInput,
                maxLength: WORKSHOP_EMPLOYEE_POSITION_MAX_LENGTH,
              },
            }}
          />
        )}
      />
    </ReferenceFormSection>
  );
}
