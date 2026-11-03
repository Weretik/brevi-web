import { ppeSupplierOfferLimits } from '@admin/products/model';
import { ReferenceFormSection } from '@admin/references/ui';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import {
  Button,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  Switch,
  TextField,
} from '@mui/material';

import type {
  PpeSupplierOfferField,
  PpeSupplierOfferFieldErrors,
  PpeSupplierOfferFormValues,
} from '@admin/products/model';

export interface PpeSupplierOption {
  id: number;
  name: string;
  isActive: boolean;
}

interface Props {
  values: PpeSupplierOfferFormValues;
  errors: PpeSupplierOfferFieldErrors;
  suppliers: readonly PpeSupplierOption[];
  ruleNames: readonly string[];
  readOnly: boolean;
  dirty: boolean;
  saving: boolean;
  onChange: <Field extends PpeSupplierOfferField>(
    field: Field,
    value: PpeSupplierOfferFormValues[Field],
  ) => void;
  onSave: () => void;
  onReset: () => void;
}

/** Supplier fields of the sheet tab «ЗІЗ» (columns D, F–H, K, N, O). */
export function PpeSupplierForm(props: Props) {
  const { values, errors, readOnly, onChange } = props;
  const url = values.supplierUrl.trim();
  const ruleMissing = values.ruleCode !== '' && !props.ruleNames.includes(values.ruleCode);
  return (
    <Stack
      component="form"
      sx={{ gap: 2 }}
      aria-label="Постачальник"
      onSubmit={(event) => {
        event.preventDefault();
        props.onSave();
      }}
    >
      <ReferenceFormSection title="Постачальник">
        <TextField
          select
          label="Постачальник"
          value={values.supplierId}
          onChange={(event) =>
            onChange('supplierId', event.target.value === '' ? '' : Number(event.target.value))
          }
          error={Boolean(errors.supplierId)}
          helperText={errors.supplierId ?? 'Список постачальників — «Контрагенти».'}
          disabled={readOnly}
          fullWidth
        >
          <MenuItem value="">—</MenuItem>
          {props.suppliers.map((supplier) => (
            <MenuItem key={supplier.id} value={supplier.id}>
              {supplier.isActive ? supplier.name : `${supplier.name} (не використовується)`}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Посилання на товар постачальника"
          value={values.supplierUrl}
          onChange={(event) => onChange('supplierUrl', event.target.value)}
          error={Boolean(errors.supplierUrl)}
          helperText={errors.supplierUrl}
          disabled={readOnly}
          fullWidth
          slotProps={{
            htmlInput: { maxLength: ppeSupplierOfferLimits.supplierUrl },
            input: {
              endAdornment: url ? (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Відкрити товар постачальника"
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    edge="end"
                  >
                    <OpenInNewOutlinedIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
            },
          }}
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
          <TextField
            label="Артикул постачальника"
            value={values.supplierSku}
            onChange={(event) => onChange('supplierSku', event.target.value)}
            error={Boolean(errors.supplierSku)}
            helperText={errors.supplierSku}
            disabled={readOnly}
            fullWidth
            slotProps={{ htmlInput: { maxLength: ppeSupplierOfferLimits.supplierSku } }}
          />
          <TextField
            label="Одиниця виміру"
            placeholder="шт."
            value={values.unit}
            onChange={(event) => onChange('unit', event.target.value)}
            error={Boolean(errors.unit)}
            helperText={errors.unit}
            disabled={readOnly}
            fullWidth
            slotProps={{ htmlInput: { maxLength: ppeSupplierOfferLimits.unit } }}
          />
        </Stack>
      </ReferenceFormSection>
      <ReferenceFormSection title="Ціна постачальника">
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
          {props.ruleNames.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </TextField>
      </ReferenceFormSection>
      {!readOnly && (
        <Stack direction="row" sx={{ gap: 1, justifyContent: 'flex-end' }}>
          <Button disabled={!props.dirty || props.saving} onClick={props.onReset}>
            Скасувати
          </Button>
          <Button type="submit" variant="contained" disabled={!props.dirty || props.saving}>
            {props.saving ? 'Збереження…' : 'Зберегти'}
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
