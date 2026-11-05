import { financeCounterpartyLimits } from '@admin/accounting/model';
import { ReferenceFormSection } from '@admin/references/ui';
import { FormControlLabel, FormHelperText, Stack, Switch, TextField } from '@mui/material';

import { FinanceCategoryFields } from '../transactions/finance-category-fields';

import type { FinanceNamedChoice } from '../transactions/finance-category-fields';
import type {
  FinanceCounterpartyField,
  FinanceCounterpartyFieldErrors,
  FinanceCounterpartyFormValues,
} from '@admin/accounting/model';

interface Props {
  values: FinanceCounterpartyFormValues;
  errors: FinanceCounterpartyFieldErrors;
  /** Expense and income categories of the current books. */
  roots: FinanceNamedChoice[];
  children: FinanceNamedChoice[];
  /** Auto-apply is only for a confirmed counterparty. */
  verified: boolean;
  onChange: <Field extends FinanceCounterpartyField>(
    field: Field,
    value: FinanceCounterpartyFormValues[Field],
  ) => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/** A finance counterparty of «Контрагенти → Фінансові». */
export function FinanceCounterpartyForm({
  values,
  errors,
  roots,
  children,
  verified,
  onChange,
}: Props) {
  const limits = financeCounterpartyLimits;
  return (
    <Stack sx={{ gap: 2 }}>
      <ReferenceFormSection title="Контрагент">
        <TextField
          label="Назва"
          placeholder="ФОП Іваненко"
          value={values.name}
          onChange={(event) => onChange('name', event.target.value)}
          error={Boolean(errors.name)}
          helperText={errors.name}
          slotProps={{ htmlInput: { maxLength: limits.name } }}
          fullWidth
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
          <TextField
            label="ЄДРПОУ / ІПН"
            value={values.edrpou}
            onChange={(event) => onChange('edrpou', event.target.value)}
            error={Boolean(errors.edrpou)}
            helperText={errors.edrpou}
            slotProps={{ htmlInput: { inputMode: 'numeric', style: mono } }}
            fullWidth
          />
          <TextField
            label="IBAN"
            value={values.iban}
            onChange={(event) => onChange('iban', event.target.value)}
            error={Boolean(errors.iban)}
            helperText={errors.iban}
            slotProps={{ htmlInput: { maxLength: limits.iban * 2, style: mono } }}
            fullWidth
          />
        </Stack>
        <TextField
          label="Назва в банку"
          value={values.bankName}
          onChange={(event) => onChange('bankName', event.target.value)}
          error={Boolean(errors.bankName)}
          helperText={errors.bankName ?? 'Як контрагент записаний у банківській виписці.'}
          slotProps={{ htmlInput: { maxLength: limits.bankName } }}
          fullWidth
        />
        <TextField
          label="Інші назви"
          value={values.aliases}
          onChange={(event) => onChange('aliases', event.target.value)}
          error={Boolean(errors.aliases)}
          helperText={errors.aliases ?? 'Кожна з нового рядка; за ними знайде пошук.'}
          multiline
          minRows={2}
          fullWidth
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Категорія за замовчуванням">
        <FinanceCategoryFields
          rootId={values.rootId}
          subcategoryId={values.subcategoryId}
          roots={roots}
          children={children}
          optional
          onRootChange={(id) => onChange('rootId', id)}
          onSubcategoryChange={(id) => onChange('subcategoryId', id)}
        />
        <FormControlLabel
          control={
            <Switch
              checked={values.autoApplyCategory}
              disabled={!verified && !values.autoApplyCategory}
              onChange={(event) => onChange('autoApplyCategory', event.target.checked)}
            />
          }
          label="Ставити цю категорію банківським рядкам автоматично"
        />
        <FormHelperText error={Boolean(errors.autoApplyCategory)} sx={{ mt: -1 }}>
          {errors.autoApplyCategory ??
            (verified
              ? 'Знадобиться для імпорту банківських виписок.'
              : 'Доступно після «Підтвердити».')}
        </FormHelperText>
      </ReferenceFormSection>
      <ReferenceFormSection title="Примітка">
        <TextField
          label="Примітка"
          value={values.note}
          onChange={(event) => onChange('note', event.target.value)}
          error={Boolean(errors.note)}
          helperText={errors.note}
          multiline
          minRows={2}
          slotProps={{ htmlInput: { maxLength: limits.note } }}
          fullWidth
        />
      </ReferenceFormSection>
    </Stack>
  );
}
