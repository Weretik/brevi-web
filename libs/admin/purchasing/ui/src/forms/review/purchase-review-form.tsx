import { formatPurchaseMessageAt, purchaseReviewNoteMaxLength } from '@admin/purchasing/model';
import { ReferenceFormSection } from '@admin/references/ui';
import { Autocomplete, TextField, Typography } from '@mui/material';

import type {
  PurchaseInvoice,
  PurchaseReviewErrors,
  PurchaseReviewFormValues,
  PurchaseSupplierOption,
} from '@admin/purchasing/model';

interface Props {
  invoice: PurchaseInvoice;
  values: PurchaseReviewFormValues;
  errors: PurchaseReviewErrors;
  suppliers: readonly PurchaseSupplierOption[];
  suppliersLoading: boolean;
  disabled: boolean;
  onChange: (values: PurchaseReviewFormValues) => void;
}

/** «Постачальник і примітка»: an active Brevi supplier (or none) and a note up to 1000 characters. */
export function PurchaseReviewForm({
  invoice,
  values,
  errors,
  suppliers,
  suppliersLoading,
  disabled,
  onChange,
}: Props) {
  // A supplier that stopped being used is not offered, but stays selectable if already linked.
  const options: PurchaseSupplierOption[] =
    invoice.supplierId !== null && !suppliers.some((x) => x.id === invoice.supplierId)
      ? [
          ...suppliers,
          {
            id: invoice.supplierId,
            name: invoice.supplierName ?? `Постачальник №${invoice.supplierId}`,
          },
        ]
      : [...suppliers];
  const selected = options.find((x) => x.id === values.supplierId) ?? null;
  const noteLength = values.note.trim().length;

  return (
    <>
      <ReferenceFormSection title="Рахунок">
        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
          {invoice.text || '—'}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontFamily: 'var(--admin-font-mono)' }}
        >
          {formatPurchaseMessageAt(invoice.messageAt)} · UID {invoice.sourceUid}
        </Typography>
      </ReferenceFormSection>
      <ReferenceFormSection title="Постачальник і примітка">
        <Autocomplete
          options={options}
          value={selected}
          loading={suppliersLoading}
          disabled={disabled}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          noOptionsText="Постачальника не знайдено"
          loadingText="Завантаження…"
          onChange={(_event, supplier) => onChange({ ...values, supplierId: supplier?.id ?? null })}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Постачальник"
              helperText="Порожнє поле — рахунок без постачальника."
            />
          )}
        />
        <TextField
          label="Примітка"
          value={values.note}
          disabled={disabled}
          multiline
          minRows={3}
          error={Boolean(errors.note)}
          helperText={errors.note ?? `${noteLength} / ${purchaseReviewNoteMaxLength}`}
          onChange={(event) => onChange({ ...values, note: event.target.value })}
        />
      </ReferenceFormSection>
    </>
  );
}
