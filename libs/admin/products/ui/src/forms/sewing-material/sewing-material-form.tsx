import {
  changeSewingMaterialKind,
  sewingMaterialKindLabels,
  sewingMaterialUnitLabels,
} from '@admin/products/model';
import { ReferenceFormSection } from '@admin/references/ui';
import { Autocomplete, MenuItem, Stack, TextField } from '@mui/material';

import type {
  SewingMaterialFieldErrors,
  SewingMaterialFormValues,
  SewingMaterialKind,
} from '@admin/products/model';
import type { Fabric, GarmentAccessory } from '@admin/references/model';

interface Props {
  values: SewingMaterialFormValues;
  errors: SewingMaterialFieldErrors;
  fabrics: readonly Fabric[];
  accessories: readonly GarmentAccessory[];
  readOnly: boolean;
  disabled: boolean;
  onChange: (values: SewingMaterialFormValues) => void;
}

interface Option {
  id: number;
  name: string;
  code: string | null;
  isActive: boolean;
  unit?: string;
}

const kinds: SewingMaterialKind[] = ['Accessory', 'OtherCost', 'Fabric'];
const label = (option: Option) => (option.code ? `${option.name} · ${option.code}` : option.name);

/**
 * Fields of the «Матеріал» side panel of «Комплектація». The main fabric is set per variant on
 * «Тканини»; a fabric here is an extra one every variant uses (for example a lining).
 */
export function SewingMaterialForm({
  values,
  errors,
  fabrics,
  accessories,
  readOnly,
  disabled,
  onChange,
}: Props) {
  const source: readonly Option[] = values.kind === 'Fabric' ? fabrics : accessories;
  const options = source.filter((item) => item.isActive || item.id === values.referenceId);
  const selected = source.find((item) => item.id === values.referenceId) ?? null;
  const input = { readOnly };
  return (
    <Stack sx={{ gap: 2 }}>
      <ReferenceFormSection title="Матеріал">
        <TextField
          select
          label="Тип"
          value={values.kind}
          onChange={(event) =>
            onChange(changeSewingMaterialKind(values, event.target.value as SewingMaterialKind))
          }
          disabled={disabled}
          slotProps={{ input }}
        >
          {kinds.map((kind) => (
            <MenuItem key={kind} value={kind}>
              {sewingMaterialKindLabels[kind]}
            </MenuItem>
          ))}
        </TextField>
        {values.kind === 'OtherCost' ? (
          <TextField
            label="Код витрати"
            value={values.costCode}
            onChange={(event) => onChange({ ...values, costCode: event.target.value })}
            required
            error={Boolean(errors.costCode)}
            helperText={errors.costCode}
            disabled={disabled}
            slotProps={{ input, htmlInput: { maxLength: 80 } }}
          />
        ) : (
          <Autocomplete
            options={options}
            value={selected}
            getOptionLabel={label}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(_event, option) =>
              onChange({
                ...values,
                referenceId: option?.id ?? null,
                // Lining and padding are measured in metres, as in the reference «Фурнітура».
                unit: values.kind === 'Fabric' ? 'Metre' : option?.unit === 'м' ? 'Metre' : 'Piece',
              })
            }
            readOnly={readOnly}
            disabled={disabled}
            noOptionsText="Нічого не знайдено"
            renderInput={(params) => (
              <TextField
                {...params}
                label={values.kind === 'Fabric' ? 'Тканина' : 'Фурнітура'}
                required
                error={Boolean(errors.referenceId)}
                helperText={errors.referenceId ?? 'Пошук за назвою або кодом.'}
              />
            )}
          />
        )}
        <Stack direction="row" sx={{ gap: 2 }}>
          <TextField
            label="Кількість на 1 виріб"
            value={values.quantity}
            onChange={(event) => onChange({ ...values, quantity: event.target.value })}
            required
            error={Boolean(errors.quantity)}
            helperText={errors.quantity}
            disabled={disabled}
            sx={{ flex: 1 }}
            slotProps={{ input, htmlInput: { inputMode: 'decimal' } }}
          />
          <TextField
            label="Од."
            value={sewingMaterialUnitLabels[values.unit]}
            disabled
            sx={{ width: 110 }}
          />
        </Stack>
        <TextField
          label="Коментар"
          value={values.comment}
          onChange={(event) => onChange({ ...values, comment: event.target.value })}
          error={Boolean(errors.comment)}
          helperText={errors.comment}
          disabled={disabled}
          multiline
          minRows={2}
          slotProps={{ input, htmlInput: { maxLength: 500 } }}
        />
      </ReferenceFormSection>
    </Stack>
  );
}
