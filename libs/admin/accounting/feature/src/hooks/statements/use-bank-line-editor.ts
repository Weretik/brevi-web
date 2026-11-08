import { useUpdateBankStatementLineMutation } from '@admin/accounting/data-access';
import {
  bankLineBody,
  counterpartyDefaultCategory,
  createBankLineFormValues,
  validateBankLine,
} from '@admin/accounting/model';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';
import { useState } from 'react';

import type {
  BankLineField,
  BankLineFieldErrors,
  BankLineFormValues,
  BankStatementLine,
  FinanceCategory,
} from '@admin/accounting/model';

/**
 * The side panel of one line: category, counterparty or a one-off name, texts and «Проводити». A picked counterparty
 * with a default category fills an empty category.
 */
export function useBankLineEditor(
  statementId: string,
  line: BankStatementLine,
  categories: readonly FinanceCategory[],
  onSaved: (message: string) => void,
) {
  const [values, setValues] = useState(() => createBankLineFormValues(line));
  const [errors, setErrors] = useState<BankLineFieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [update, updateState] = useUpdateBankStatementLineMutation();

  function change<Field extends BankLineField>(field: Field, value: BankLineFormValues[Field]) {
    setValues((current) => {
      const next = { ...current, [field]: value };
      if (field === 'rootId') return { ...next, subcategoryId: '' };
      if (field === 'counterparty' && !current.rootId && line.type) {
        const category = counterpartyDefaultCategory(
          categories,
          next.counterparty,
          'Current',
          line.type,
        );
        if (category) return { ...next, ...category };
      }
      return next;
    });
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function save() {
    if (updateState.isLoading) return;
    const validation = validateBankLine(values);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setMessage(null);
    try {
      await update({ statementId, lineId: line.id, body: bankLineBody(values, line) }).unwrap();
      onSaved(`Рядок ${line.rowNumber} збережено.`);
    } catch (error) {
      if (isAdminApiError(error)) setErrors(error.fieldErrors as BankLineFieldErrors);
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти рядок.'));
    }
  }

  return {
    values,
    errors,
    message,
    saving: updateState.isLoading,
    change,
    save,
  };
}
