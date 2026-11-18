import { ReferenceFormSection } from '@admin/references/ui';
import { FormControlLabel, MenuItem, Switch, TextField } from '@mui/material';

import type {
  PpeSupplierOfferField,
  PpeSupplierOfferFieldErrors,
  PpeSupplierOfferFormValues,
} from '@admin/products/model';

interface Props {
  values: PpeSupplierOfferFormValues;
  errors: PpeSupplierOfferFieldErrors;
  ruleNames: readonly string[];
  readOnly: boolean;
  /** The supplier (purchase) price is for Admin only (CAT-019). */
  showCost: boolean;
  onChange: <Field extends PpeSupplierOfferField>(
    field: Field,
    value: PpeSupplierOfferFormValues[Field],
  ) => void;
}

/** The supplier price, «Дозволити ручну ціну» and the pricing rule. */
export function PpeSupplierPricingSection({
  values,
  errors,
  ruleNames,
  readOnly,
  showCost,
  onChange,
}: Props) {
  const ruleMissing = values.ruleCode !== '' && !ruleNames.includes(values.ruleCode);
  return (
    <ReferenceFormSection title={showCost ? 'Ціна постачальника' : 'Ціноутворення'}>
      {showCost && (
        <TextField
          label="Ціна постачальника, грн"
          value={values.supplierPrice}
          onChange={(event) => onChange('supplierPrice', event.target.value)}
          error={Boolean(errors.supplierPrice)}
          helperText={errors.supplierPrice}
          disabled={readOnly}
          fullWidth
          slotProps={{ htmlInput: { inputMode: 'decimal' } }}
        />
      )}
      <FormControlLabel
        control={
          <Switch
            checked={values.allowManualPrice}
            onChange={(event) => onChange('allowManualPrice', event.target.checked)}
            disabled={readOnly}
          />
        }
        label="Дозволити ручну ціну (автооновлення не змінює ціну)"
      />
      <TextField
        select
        label="Правило ціноутворення"
        value={values.ruleCode}
        onChange={(event) => onChange('ruleCode', event.target.value)}
        error={ruleMissing}
        helperText={
          ruleMissing
            ? 'Такого правила немає в «Параметри ціноутворення».'
            : 'Відсотки правил — «Параметри ціноутворення».'
        }
        disabled={readOnly}
        fullWidth
      >
        <MenuItem value="">—</MenuItem>
        {ruleMissing && <MenuItem value={values.ruleCode}>{values.ruleCode}</MenuItem>}
        {ruleNames.map((name) => (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        ))}
      </TextField>
    </ReferenceFormSection>
  );
}
