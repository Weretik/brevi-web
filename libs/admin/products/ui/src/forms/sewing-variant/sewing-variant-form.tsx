import { ReferenceFormSection } from '@admin/references/ui';
import { Autocomplete, FormControlLabel, Stack, Switch, TextField } from '@mui/material';

import type { SewingVariantFieldErrors, SewingVariantFormValues } from '@admin/products/model';
import type { Fabric } from '@admin/references/model';

interface Props {
  values: SewingVariantFormValues;
  errors: SewingVariantFieldErrors;
  fabrics: readonly Fabric[];
  readOnly: boolean;
  disabled: boolean;
  onChange: (values: SewingVariantFormValues) => void;
}

const label = (fabric: Fabric) => (fabric.code ? `${fabric.name} · ${fabric.code}` : fabric.name);

/**
 * Fields of the «Тканина» side panel: which fabric the variant is sewn from, how many metres one
 * product takes, its sale SKU on the site and whether it is sold.
 */
export function SewingVariantForm({
  values,
  errors,
  fabrics,
  readOnly,
  disabled,
  onChange,
}: Props) {
  const options = fabrics.filter((fabric) => fabric.isActive || fabric.id === values.fabricId);
  const selected = fabrics.find((fabric) => fabric.id === values.fabricId) ?? null;
  const input = { readOnly };
  return (
    <Stack sx={{ gap: 2 }}>
      <ReferenceFormSection title="Тканина">
        <Autocomplete
          options={options}
          value={selected}
          getOptionLabel={label}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(_event, fabric) => onChange({ ...values, fabricId: fabric?.id ?? null })}
          readOnly={readOnly}
          disabled={disabled}
          noOptionsText="Тканину не знайдено"
          renderInput={(params) => (
            <TextField
              {...params}
              label="Тканина"
              required
              error={Boolean(errors.fabricId)}
              helperText={errors.fabricId ?? 'Пошук за назвою або кодом FAB.'}
            />
          )}
        />
        <TextField
          label="Розхід на 1 виріб, м"
          value={values.fabricQuantity}
          onChange={(event) => onChange({ ...values, fabricQuantity: event.target.value })}
          required
          error={Boolean(errors.fabricQuantity)}
          helperText={errors.fabricQuantity}
          disabled={disabled}
          slotProps={{ input, htmlInput: { inputMode: 'decimal' } }}
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Сайт">
        <TextField
          label="Артикул"
          value={values.saleSku}
          onChange={(event) => onChange({ ...values, saleSku: event.target.value })}
          required
          error={Boolean(errors.saleSku)}
          helperText={errors.saleSku ?? 'Артикул цієї тканини на сайті.'}
          disabled={disabled}
          slotProps={{ input, htmlInput: { maxLength: 80 } }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={values.active}
              onChange={(event) =>
                !readOnly && onChange({ ...values, active: event.target.checked })
              }
              disabled={disabled || readOnly}
            />
          }
          label="Продається"
        />
      </ReferenceFormSection>
    </Stack>
  );
}
