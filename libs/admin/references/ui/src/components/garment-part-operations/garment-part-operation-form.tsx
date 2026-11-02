import {
  Alert,
  Button,
  FormControlLabel,
  MenuItem,
  Skeleton,
  Stack,
  Switch,
  TextField,
} from '@mui/material';

import { ReferenceFormSection } from '../reference-editor/reference-form-section';

import type {
  GarmentPart,
  GarmentPartOperationField,
  GarmentPartOperationFieldErrors,
  GarmentPartOperationFormValues,
} from '@admin/references/model';

interface Props {
  creating: boolean;
  values: GarmentPartOperationFormValues;
  errors: GarmentPartOperationFieldErrors;
  groups: GarmentPart[];
  groupsLoading: boolean;
  groupsError: string | null;
  onChange: (field: GarmentPartOperationField, value: string | boolean) => void;
  onRetryGroups: () => void;
}

export function GarmentPartOperationForm({
  creating,
  values,
  errors,
  groups,
  groupsLoading,
  groupsError,
  onChange,
  onRetryGroups,
}: Props) {
  const text = (field: GarmentPartOperationField) => ({
    value: values[field] as string,
    onChange: (event: { target: { value: string } }) => onChange(field, event.target.value),
    error: Boolean(errors[field]),
    helperText: errors[field],
  });

  return (
    <Stack sx={{ gap: 2 }}>
      <ReferenceFormSection title="Основні дані">
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
          <TextField
            label="ID"
            type="number"
            {...text('id')}
            disabled={!creating}
            slotProps={{ htmlInput: { min: 1, step: 1 } }}
            sx={{ width: { sm: 120 } }}
          />
          <TextField
            label="Код"
            placeholder="OP-189"
            {...text('code')}
            helperText={errors.code ?? 'Код з таблиці калькулятора'}
            slotProps={{ htmlInput: { maxLength: 20 } }}
            fullWidth
          />
        </Stack>
        <TextField label="Назва" {...text('name')} autoFocus fullWidth />
        <FormControlLabel
          control={
            <Switch
              checked={values.isActive}
              onChange={(event) => onChange('isActive', event.target.checked)}
            />
          }
          label="Активна"
        />
      </ReferenceFormSection>

      <ReferenceFormSection title="Де виконується">
        {groupsLoading && <Skeleton variant="rounded" height={56} />}
        {groupsError && (
          <Alert
            severity="error"
            action={
              <Button type="button" onClick={onRetryGroups}>
                Повторити
              </Button>
            }
          >
            {groupsError}
          </Alert>
        )}
        {!groupsLoading && !groupsError && (
          <TextField select label="Група деталей" {...text('garmentPartName')} fullWidth>
            {values.garmentPartName &&
              !groups.some((group) => group.name === values.garmentPartName) && (
                <MenuItem value={values.garmentPartName}>{values.garmentPartName}</MenuItem>
              )}
            {groups.map((group) => (
              <MenuItem key={group.id} value={group.name}>
                {group.name}
              </MenuItem>
            ))}
          </TextField>
        )}
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
          <TextField label="Вузол / елемент" {...text('element')} fullWidth />
          <TextField label="Варіант виконання" {...text('variant')} fullWidth />
        </Stack>
      </ReferenceFormSection>

      <ReferenceFormSection title="Норма часу">
        <FormControlLabel
          control={
            <Switch
              checked={values.minutesPerProduct}
              onChange={(event) => onChange('minutesPerProduct', event.target.checked)}
            />
          }
          label="Час вказується для кожного виробу"
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
          <TextField
            label="Норма, хв"
            type="number"
            {...text('min')}
            disabled={values.minutesPerProduct}
            helperText={errors.min ?? 'Вартість рахується з налаштувань пошиву'}
            slotProps={{ htmlInput: { min: 0, max: 10000, step: 'any' } }}
            fullWidth
          />
          <TextField
            label="Дата перевірки"
            type="date"
            {...text('normCheckedAt')}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
        </Stack>
      </ReferenceFormSection>

      <ReferenceFormSection title="Нотатки">
        <TextField
          label="Примітки"
          {...text('notes')}
          multiline
          minRows={2}
          slotProps={{ htmlInput: { maxLength: 1000 } }}
          fullWidth
        />
      </ReferenceFormSection>
    </Stack>
  );
}
