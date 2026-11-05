import { financeTransactionLimits } from '@admin/accounting/model';
import { Box, Button, Checkbox, FormControlLabel, Stack, Switch, TextField } from '@mui/material';

import { FinanceCategoryFields } from './finance-category-fields';
import { FinanceCounterpartyPicker } from '../counterparties/finance-counterparty-picker';

import type { FinanceNamedChoice } from './finance-category-fields';
import type { FinanceCounterpartySearch } from './finance-counterparty-fields';
import type {
  FinanceTransactionField,
  FinanceTransactionFieldErrors,
  FinanceTransactionFormValues,
} from '@admin/accounting/model';
import type { FormEvent } from 'react';

interface Props {
  /** Unique per card, for the form. */
  formId: string;
  /**
   * `card` is its own form in one line with «Підтвердити»; `panel` stacks the fields inside the
   * side panel's form, whose footer submits.
   */
  layout?: 'card' | 'panel';
  values: FinanceTransactionFormValues;
  errors: FinanceTransactionFieldErrors;
  roots: FinanceNamedChoice[];
  children: FinanceNamedChoice[];
  counterpartySearch: FinanceCounterpartySearch;
  saving: boolean;
  /** «Запамʼятати» is offered only for a finance counterparty; null hides it. */
  rememberLabel: string | null;
  remember: boolean;
  onRememberChange: (remember: boolean) => void;
  onChange: <Field extends FinanceTransactionField>(
    field: Field,
    value: FinanceTransactionFormValues[Field],
  ) => void;
  onSubmit: () => void;
}

/**
 * «Перевірити» in one line: who the operation is with, its category and subcategory, and
 * «Підтвердити». The date, account and amount never change here.
 */
export function FinanceTransactionReviewForm({
  formId,
  layout = 'card',
  values,
  errors,
  roots,
  children,
  counterpartySearch,
  saving,
  rememberLabel,
  remember,
  onRememberChange,
  onChange,
  onSubmit,
}: Props) {
  const card = layout === 'card';
  const form = card
    ? {
        component: 'form' as const,
        id: formId,
        noValidate: true,
        onSubmit: (event: FormEvent) => {
          event.preventDefault();
          onSubmit();
        },
      }
    : {};
  return (
    <Stack {...form} sx={{ gap: 1.5 }}>
      <Box
        sx={{
          display: 'grid',
          gap: 1.5,
          alignItems: 'start',
          gridTemplateColumns: card ? { xs: '1fr', md: 'repeat(3, minmax(0, 1fr)) auto' } : '1fr',
        }}
      >
        {values.oneoff ? (
          <TextField
            label="Разовий контрагент"
            size="small"
            value={values.oneoffName}
            onChange={(event) => onChange('oneoffName', event.target.value)}
            error={Boolean(errors.oneoffName)}
            helperText={errors.oneoffName}
            slotProps={{ htmlInput: { maxLength: financeTransactionLimits.oneoffName } }}
            fullWidth
          />
        ) : (
          <FinanceCounterpartyPicker
            {...counterpartySearch}
            compact
            value={values.counterparty}
            error={errors.counterparty}
            onChange={(choice) => onChange('counterparty', choice)}
          />
        )}
        <FinanceCategoryFields
          rootId={values.rootId}
          subcategoryId={values.subcategoryId}
          roots={roots}
          children={children}
          error={errors.rootId}
          size="small"
          onRootChange={(id) => onChange('rootId', id)}
          onSubcategoryChange={(id) => onChange('subcategoryId', id)}
        />
        {card && (
          <Button
            type="submit"
            variant="contained"
            disabled={saving || !values.rootId}
            sx={{ height: 40 }}
          >
            Підтвердити
          </Button>
        )}
      </Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ columnGap: 3, rowGap: 0.5 }}>
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={values.oneoff}
              onChange={(event) => onChange('oneoff', event.target.checked)}
            />
          }
          label="Разова назва"
          slotProps={{ typography: { variant: 'body2' } }}
        />
        {rememberLabel && (
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={remember}
                onChange={(event) => onRememberChange(event.target.checked)}
              />
            }
            label={rememberLabel}
            slotProps={{ typography: { variant: 'body2' } }}
          />
        )}
      </Stack>
    </Stack>
  );
}
