import { financeTransactionLimits } from '@admin/accounting/model';
import { ReferenceFormSection } from '@admin/references/ui';
import { TextField } from '@mui/material';

import type {
  FinanceTransactionField,
  FinanceTransactionFieldErrors,
  FinanceTransactionFormValues,
} from '@admin/accounting/model';

/** «Подробиці» of an operation: the description and the note. */
export function FinanceTransactionDetailsFields({
  values,
  errors,
  onChange,
}: {
  values: FinanceTransactionFormValues;
  errors: FinanceTransactionFieldErrors;
  onChange: <Field extends FinanceTransactionField>(
    field: Field,
    value: FinanceTransactionFormValues[Field],
  ) => void;
}) {
  return (
    <ReferenceFormSection title="Подробиці">
      <TextField
        label="Опис"
        value={values.description}
        onChange={(event) => onChange('description', event.target.value)}
        error={Boolean(errors.description)}
        helperText={errors.description}
        slotProps={{ htmlInput: { maxLength: financeTransactionLimits.description } }}
        fullWidth
      />
      <TextField
        label="Примітка"
        value={values.comment}
        onChange={(event) => onChange('comment', event.target.value)}
        error={Boolean(errors.comment)}
        helperText={errors.comment}
        multiline
        minRows={2}
        slotProps={{ htmlInput: { maxLength: financeTransactionLimits.comment } }}
        fullWidth
      />
    </ReferenceFormSection>
  );
}
