import {
  useCreateFinanceTransactionMutation,
  useGetFinanceTransactionHistoryQuery,
  useUpdateFinanceTransactionMutation,
} from '@admin/accounting/data-access';
import {
  createFinanceTransactionFormValues,
  financeTransactionBody,
  formatSignedMinor,
  nextFinanceTransactionFormValues,
  validateFinanceTransaction,
} from '@admin/accounting/model';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';
import { useState } from 'react';

import type {
  CategoryDirection,
  FinanceTransaction,
  FinanceTransactionField,
  FinanceTransactionFieldErrors,
  FinanceTransactionFormValues,
  LedgerScope,
} from '@admin/accounting/model';

export type FinanceMovementEditorMode = 'create' | 'view' | 'edit';

interface Options {
  mode: FinanceMovementEditorMode;
  transaction: FinanceTransaction | null;
  scope: LedgerScope;
  type: CategoryDirection;
  cutoverDate: string;
  /** Date of a new operation. */
  date: string;
  onSaved: (message: string) => void;
}

/** Only an active hand-made operation can be changed; bank lines get their own form later. */
export const canEditTransaction = (transaction: FinanceTransaction) =>
  transaction.status === 'Active' && transaction.source === 'Manual';

/**
 * Side panel of one operation: view with history, edit, and create with an optional «next one»
 * that keeps the date, account, type and category.
 */
export function useFinanceTransactionEditor(options: Options) {
  const { scope, cutoverDate, onSaved } = options;
  const [mode, setMode] = useState(options.mode);
  const transaction = options.transaction;
  const [values, setValues] = useState(() =>
    createFinanceTransactionFormValues(options.transaction, options.type, options.date),
  );
  const [errors, setErrors] = useState<FinanceTransactionFieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [addNext, setAddNext] = useState(false);
  const [create, createState] = useCreateFinanceTransactionMutation();
  const [update, updateState] = useUpdateFinanceTransactionMutation();
  const history = useGetFinanceTransactionHistoryQuery(transaction?.id ?? '', {
    skip: !transaction || mode !== 'view',
  });
  const saving = createState.isLoading || updateState.isLoading;

  function change<Field extends FinanceTransactionField>(
    field: Field,
    value: FinanceTransactionFormValues[Field],
  ) {
    setValues((current) => {
      const next = { ...current, [field]: value };
      // A new type or root makes the old category choice meaningless.
      if (field === 'type') return { ...next, rootId: '', subcategoryId: '' };
      if (field === 'rootId') return { ...next, subcategoryId: '' };
      return next;
    });
    setErrors((current) => ({ ...current, [field]: undefined }));
    setNotice(null);
  }

  async function save() {
    if (saving || mode === 'view') return;
    const validation = validateFinanceTransaction(
      values,
      scope,
      cutoverDate,
      transaction?.date ?? null,
    );
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setMessage(null);
    const body = financeTransactionBody(values);
    try {
      const saved = transaction
        ? await update({
            id: transaction.id,
            body: { ...body, version: transaction.version },
          }).unwrap()
        : await create({ ...body, scope }).unwrap();
      if (!transaction && addNext) {
        setValues(nextFinanceTransactionFormValues(values));
        setNotice(
          `Додано ${formatSignedMinor(saved.type, saved.amountMinor, saved.currency)}. Вводьте наступну.`,
        );
        return;
      }
      onSaved(transaction ? 'Операцію збережено.' : 'Операцію додано.');
    } catch (error) {
      if (isAdminApiError(error)) setErrors(error.fieldErrors);
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти операцію.'));
    }
  }

  return {
    mode,
    transaction,
    values,
    errors,
    message,
    notice,
    saving,
    addNext,
    setAddNext,
    history: {
      entries: history.data ?? [],
      loading: history.isLoading,
      error: history.error
        ? adminApiErrorMessage(history.error, 'Не вдалося завантажити історію.')
        : null,
    },
    change,
    save,
    enableEditing: () => {
      if (!transaction || !canEditTransaction(transaction)) return;
      setValues(
        createFinanceTransactionFormValues(transaction, transaction.type, transaction.date),
      );
      setMode('edit');
    },
  };
}
