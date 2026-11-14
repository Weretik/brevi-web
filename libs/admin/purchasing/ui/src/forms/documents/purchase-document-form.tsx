import {
  Alert,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

import { purchaseDocumentBalanceText } from './purchase-document-balance';
import { PurchaseDocumentItems } from './purchase-document-items';

import type { PurchaseDocumentCheck, PurchaseDocumentFormValues } from '@admin/purchasing/model';

interface Props {
  values: PurchaseDocumentFormValues;
  check: PurchaseDocumentCheck;
  /** Show field reasons only after the first «Зберегти». */
  showErrors: boolean;
  disabled: boolean;
  onChange: (values: PurchaseDocumentFormValues) => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/**
 * «Виправити»: the facts of one original as the AI read them. Wrong lines are highlighted, the
 * sum of the positions is counted while typing and compared with «До оплати» to the kopeck.
 */
export function PurchaseDocumentForm({ values, check, showErrors, disabled, onChange }: Props) {
  const set = <K extends keyof PurchaseDocumentFormValues>(
    field: K,
    value: PurchaseDocumentFormValues[K],
  ) => onChange({ ...values, [field]: value });
  const error = (field: keyof PurchaseDocumentCheck['errors']) =>
    showErrors ? check.errors[field] : undefined;
  const withVat = values.vat === 'WithVat';

  return (
    <Stack sx={{ gap: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 1.5 }}>
        <TextField
          label="Вид документа"
          size="small"
          value={values.documentType}
          error={Boolean(error('documentType'))}
          helperText={error('documentType')}
          disabled={disabled}
          onChange={(event) => set('documentType', event.target.value)}
          sx={{ flex: 2 }}
        />
        <TextField
          label="Номер"
          size="small"
          value={values.documentNumber}
          error={Boolean(error('documentNumber'))}
          helperText={error('documentNumber')}
          disabled={disabled}
          onChange={(event) => set('documentNumber', event.target.value)}
          sx={{ flex: 1 }}
        />
        <TextField
          label="Дата"
          type="date"
          size="small"
          value={values.documentDate}
          error={Boolean(error('documentDate'))}
          helperText={error('documentDate')}
          disabled={disabled}
          onChange={(event) => set('documentDate', event.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ flex: 1 }}
        />
      </Stack>
      <TextField
        label="Постачальник (як у рахунку)"
        size="small"
        value={values.supplierName}
        error={Boolean(error('supplierName'))}
        helperText={error('supplierName')}
        disabled={disabled}
        onChange={(event) => set('supplierName', event.target.value)}
      />
      <Stack direction="row" sx={{ gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={values.vat}
          disabled={disabled}
          aria-label="ПДВ"
          onChange={(_, value) => value && set('vat', value)}
        >
          <ToggleButton value="WithoutVat">Без ПДВ</ToggleButton>
          <ToggleButton value="WithVat">З ПДВ</ToggleButton>
        </ToggleButtonGroup>
        {withVat && (
          <FormControlLabel
            control={
              <Checkbox
                checked={values.pricesIncludeVat}
                disabled={disabled}
                onChange={(event) => set('pricesIncludeVat', event.target.checked)}
              />
            }
            label="Ціни вже з ПДВ"
          />
        )}
      </Stack>

      <PurchaseDocumentItems
        items={values.items}
        check={check}
        showErrors={showErrors}
        disabled={disabled}
        onChange={(items) => set('items', items)}
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 1.5 }}>
        {withVat && (
          <TextField
            label="Сума ПДВ"
            size="small"
            inputMode="decimal"
            value={values.vatAmount}
            error={Boolean(error('vatAmount'))}
            helperText={error('vatAmount')}
            disabled={disabled}
            onChange={(event) => set('vatAmount', event.target.value)}
            sx={{ flex: 1 }}
          />
        )}
        <TextField
          label="До оплати"
          size="small"
          inputMode="decimal"
          value={values.totalPayable}
          error={Boolean(error('totalPayable'))}
          helperText={error('totalPayable')}
          disabled={disabled}
          onChange={(event) => set('totalPayable', event.target.value)}
          sx={{ flex: 1 }}
        />
      </Stack>
      <Alert severity={check.balanced ? 'success' : 'warning'} sx={mono}>
        {purchaseDocumentBalanceText(check, withVat && !values.pricesIncludeVat)}
      </Alert>
    </Stack>
  );
}
