import { ReferenceFormSection } from '@admin/references/ui';
import { Stack } from '@mui/material';

import { FinanceCategoryFields } from './finance-category-fields';
import { FinanceCounterpartyFields } from './finance-counterparty-fields';

import type { FinanceNamedChoice } from './finance-category-fields';
import type { FinanceCounterpartySearch } from './finance-counterparty-fields';
import type {
  FinanceTransactionField,
  FinanceTransactionFieldErrors,
  FinanceTransactionFormValues,
} from '@admin/accounting/model';
import type { ReactNode } from 'react';

interface Props {
  /** The operation as it is: date, account, amount, description. */
  summary: ReactNode;
  values: FinanceTransactionFormValues;
  errors: FinanceTransactionFieldErrors;
  roots: FinanceNamedChoice[];
  children: FinanceNamedChoice[];
  counterpartySearch: FinanceCounterpartySearch;
  onChange: <Field extends FinanceTransactionField>(
    field: Field,
    value: FinanceTransactionFormValues[Field],
  ) => void;
}

/** «Перевірити»: only the category and who the operation is with can change here. */
export function FinanceTransactionReviewForm({
  summary,
  values,
  errors,
  roots,
  children,
  counterpartySearch,
  onChange,
}: Props) {
  return (
    <Stack sx={{ gap: 2 }}>
      {summary}
      <ReferenceFormSection title="Категорія">
        <FinanceCategoryFields
          rootId={values.rootId}
          subcategoryId={values.subcategoryId}
          roots={roots}
          children={children}
          error={errors.rootId}
          onRootChange={(id) => onChange('rootId', id)}
          onSubcategoryChange={(id) => onChange('subcategoryId', id)}
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Контрагент">
        <FinanceCounterpartyFields
          values={values}
          errors={errors}
          search={counterpartySearch}
          onChange={onChange}
        />
      </ReferenceFormSection>
    </Stack>
  );
}
