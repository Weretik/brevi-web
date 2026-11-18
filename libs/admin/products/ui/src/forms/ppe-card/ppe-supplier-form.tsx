import { ppeSupplierOfferLimits } from '@admin/products/model';
import { ReferenceFormSection } from '@admin/references/ui';
import { Button, Link, Stack, TextField } from '@mui/material';

import { PpeSupplierPricingSection } from './ppe-supplier-pricing-section';
import { PpeLinkField } from '../../components/ppe-card/ppe-link-field';
import { PpeSupplierSelect } from '../../components/ppe-card/ppe-supplier-select';

import type { PpeSupplierOption } from '../../components/ppe-card/ppe-supplier-select';
import type {
  PpeSupplierOfferField,
  PpeSupplierOfferFieldErrors,
  PpeSupplierOfferFormValues,
} from '@admin/products/model';

interface Props {
  values: PpeSupplierOfferFormValues;
  errors: PpeSupplierOfferFieldErrors;
  suppliers: readonly PpeSupplierOption[];
  ruleNames: readonly string[];
  readOnly: boolean;
  /** The supplier (purchase) price is for Admin only (CAT-019). */
  showCost?: boolean;
  /** Opens the card of the chosen supplier (CAT-019). */
  onOpenSupplier?: (supplierId: number) => void;
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
  const { values, errors, readOnly, onChange, showCost = true } = props;
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
        <PpeSupplierSelect
          label="Постачальник"
          value={values.supplierId}
          suppliers={props.suppliers}
          error={errors.supplierId}
          helperText="Список постачальників — «Контрагенти»."
          disabled={readOnly}
          onChange={(value) => onChange('supplierId', value)}
        />
        {props.onOpenSupplier && typeof values.supplierId === 'number' && (
          <Link
            component="button"
            type="button"
            underline="hover"
            onClick={() => {
              if (typeof values.supplierId === 'number') props.onOpenSupplier?.(values.supplierId);
            }}
            sx={{ alignSelf: 'flex-start', color: 'primary.dark' }}
          >
            Переглянути постачальника
          </Link>
        )}
        <PpeLinkField
          label="Посилання на товар постачальника"
          openLabel="Відкрити товар постачальника"
          value={values.supplierUrl}
          maxLength={ppeSupplierOfferLimits.supplierUrl}
          error={errors.supplierUrl}
          disabled={readOnly}
          onChange={(value) => onChange('supplierUrl', value)}
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
      <PpeSupplierPricingSection
        values={values}
        errors={errors}
        ruleNames={props.ruleNames}
        readOnly={readOnly}
        showCost={showCost}
        onChange={onChange}
      />
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
