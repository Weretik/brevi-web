import {
  useCreateFinanceTransferMutation,
  useGetFinanceTransferHistoryQuery,
  useUpdateFinanceTransferMutation,
} from '@admin/accounting/data-access';
import {
  createFinanceTransferFormValues,
  financeTransferBody,
  validateFinanceTransfer,
} from '@admin/accounting/model';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';
import { useState } from 'react';

import type { FinanceMovementEditorMode } from '../transactions/use-finance-transaction-editor';
import type {
  FinanceTransfer,
  FinanceTransferField,
  FinanceTransferFieldErrors,
  FinanceTransferFormValues,
  LedgerScope,
} from '@admin/accounting/model';

interface Options {
  mode: FinanceMovementEditorMode;
  transfer: FinanceTransfer | null;
  scope: LedgerScope;
  cutoverDate: string;
  date: string;
  currencyOf: (accountId: string) => string | undefined;
  onSaved: (message: string) => void;
}

export const canEditTransfer = (transfer: FinanceTransfer) =>
  transfer.status === 'Active' && transfer.source === 'Manual';

/** Side panel of one transfer: view with history, edit and create. */
export function useFinanceTransferEditor(options: Options) {
  const { scope, cutoverDate, currencyOf, onSaved } = options;
  const [mode, setMode] = useState(options.mode);
  const transfer = options.transfer;
  const [values, setValues] = useState(() =>
    createFinanceTransferFormValues(options.transfer, options.date),
  );
  const [errors, setErrors] = useState<FinanceTransferFieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [create, createState] = useCreateFinanceTransferMutation();
  const [update, updateState] = useUpdateFinanceTransferMutation();
  const history = useGetFinanceTransferHistoryQuery(transfer?.id ?? '', {
    skip: !transfer || mode !== 'view',
  });
  const saving = createState.isLoading || updateState.isLoading;

  function change<Field extends FinanceTransferField>(
    field: Field,
    value: FinanceTransferFormValues[Field],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function save() {
    if (saving || mode === 'view') return;
    const validation = validateFinanceTransfer(
      values,
      scope,
      cutoverDate,
      transfer?.date ?? null,
      currencyOf,
    );
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setMessage(null);
    const body = financeTransferBody(values);
    try {
      if (transfer)
        await update({ id: transfer.id, body: { ...body, version: transfer.version } }).unwrap();
      else await create({ ...body, scope }).unwrap();
      onSaved(transfer ? 'Переказ збережено.' : 'Переказ додано.');
    } catch (error) {
      if (isAdminApiError(error)) setErrors(error.fieldErrors);
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти переказ.'));
    }
  }

  return {
    mode,
    transfer,
    values,
    errors,
    message,
    saving,
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
      if (!transfer || !canEditTransfer(transfer)) return;
      setValues(createFinanceTransferFormValues(transfer, transfer.date));
      setMode('edit');
    },
  };
}
