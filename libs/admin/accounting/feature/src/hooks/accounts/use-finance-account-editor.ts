import {
  useCreateFinanceAccountMutation,
  useGetFinanceAccountHistoryQuery,
  useSetFinanceAccountActiveMutation,
  useSetFinanceAccountCutoverMutation,
  useUpdateFinanceAccountMutation,
} from '@admin/accounting/data-access';
import {
  createFinanceAccountFormValues,
  createFinanceCutoverFormValues,
  financeAccountBody,
  financeCutoverBody,
  validateFinanceAccount,
  validateFinanceCutover,
} from '@admin/accounting/model';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';
import { useState } from 'react';

import type {
  FinanceAccount,
  FinanceAccountField,
  FinanceAccountFieldErrors,
  FinanceAccountFormValues,
} from '@admin/accounting/model';

export type FinanceAccountEditorMode = 'create' | 'view' | 'edit' | 'cutover';

/**
 * One side panel for an account: view (with history and the balance on 01.10), edit, create and
 * «Підтвердити залишок». Every change sends the version the panel opened with; the panel shows
 * the account the server returned, so the next change uses the new version.
 */
export function useFinanceAccountEditor(
  initialMode: FinanceAccountEditorMode,
  initialAccount: FinanceAccount | null,
  today: string,
  newSortOrder: number,
  onSaved: (message: string) => void,
) {
  const [mode, setMode] = useState(initialMode);
  const [account, setAccount] = useState(initialAccount);
  const [values, setValues] = useState(() => createFinanceAccountFormValues(initialAccount, today));
  const [errors, setErrors] = useState<FinanceAccountFieldErrors>({});
  const [cutover, setCutover] = useState(() =>
    initialAccount ? createFinanceCutoverFormValues(initialAccount) : { balance: '' },
  );
  const [cutoverError, setCutoverError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [create, createState] = useCreateFinanceAccountMutation();
  const [update, updateState] = useUpdateFinanceAccountMutation();
  const [setBalance, balanceState] = useSetFinanceAccountCutoverMutation();
  const [setActive, activeState] = useSetFinanceAccountActiveMutation();
  const history = useGetFinanceAccountHistoryQuery(account?.id ?? '', {
    skip: !account || mode !== 'view',
  });
  const saving =
    createState.isLoading ||
    updateState.isLoading ||
    balanceState.isLoading ||
    activeState.isLoading;

  function change<Field extends FinanceAccountField>(
    field: Field,
    value: FinanceAccountFormValues[Field],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function run(action: () => Promise<FinanceAccount>, failure: string) {
    setMessage(null);
    try {
      const saved = await action();
      setAccount(saved);
      return saved;
    } catch (error) {
      if (isAdminApiError(error)) setErrors(error.fieldErrors);
      setMessage(adminApiErrorMessage(error, failure));
      return null;
    }
  }

  async function save() {
    if (saving || mode === 'view') return;
    if (mode === 'cutover') {
      const problem = validateFinanceCutover(cutover);
      setCutoverError(problem);
      if (problem || !account) return;
      const saved = await run(
        () =>
          setBalance({
            id: account.id,
            body: financeCutoverBody(cutover, account.version),
          }).unwrap(),
        'Не вдалося підтвердити залишок.',
      );
      if (saved) setMode('view');
      return;
    }
    const validation = validateFinanceAccount(values);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    const body = financeAccountBody(values, account?.sortOrder ?? newSortOrder);
    const saved = await run(
      () =>
        account
          ? update({ id: account.id, body: { ...body, version: account.version } }).unwrap()
          : create(body).unwrap(),
      'Не вдалося зберегти рахунок.',
    );
    if (saved) onSaved(account ? 'Рахунок збережено.' : 'Рахунок додано.');
  }

  async function clearCutover() {
    if (!account || saving) return;
    const saved = await run(
      () =>
        setBalance({
          id: account.id,
          body: { balanceMinor: null, confirmed: false, version: account.version },
        }).unwrap(),
      'Не вдалося скасувати залишок.',
    );
    if (saved) setCutover({ balance: '' });
  }

  async function toggleActive() {
    if (!account || saving) return;
    const saved = await run(
      () =>
        setActive({ id: account.id, active: !account.active, version: account.version }).unwrap(),
      account.active ? 'Не вдалося архівувати рахунок.' : 'Не вдалося відновити рахунок.',
    );
    if (saved) onSaved(saved.active ? 'Рахунок відновлено.' : 'Рахунок перенесено в архів.');
  }

  return {
    mode,
    account,
    values,
    errors,
    cutover,
    cutoverError,
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
    changeCutover: (next: typeof cutover) => {
      setCutover(next);
      setCutoverError(null);
    },
    save,
    clearCutover,
    toggleActive,
    enableEditing: () => {
      setValues(createFinanceAccountFormValues(account, today));
      setMode('edit');
    },
    openCutover: () => {
      if (account) setCutover(createFinanceCutoverFormValues(account));
      setMode('cutover');
    },
    backToView: () => setMode('view'),
  };
}
