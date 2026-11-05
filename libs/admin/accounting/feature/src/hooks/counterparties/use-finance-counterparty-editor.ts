import {
  useArchiveFinanceCounterpartyMutation,
  useCreateFinanceCounterpartyMutation,
  useGetFinanceCounterpartyHistoryQuery,
  useMergeFinanceCounterpartyMutation,
  useRestoreFinanceCounterpartyMutation,
  useUpdateFinanceCounterpartyMutation,
  useVerifyFinanceCounterpartyMutation,
} from '@admin/accounting/data-access';
import {
  createFinanceCounterpartyFormValues,
  financeCounterpartyBody,
  validateFinanceCounterparty,
} from '@admin/accounting/model';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';
import { useState } from 'react';

import type {
  FinanceCategory,
  FinanceCounterparty,
  FinanceCounterpartyField,
  FinanceCounterpartyFieldErrors,
  FinanceCounterpartyFormValues,
} from '@admin/accounting/model';

export type FinanceCounterpartyEditorMode = 'create' | 'view' | 'edit';

type StateAction = 'verify' | 'archive' | 'restore';

const stateMessages: Record<StateAction, string> = {
  verify: 'Контрагента підтверджено; його операції більше не потребують перевірки.',
  archive: 'Контрагента перенесено в архів.',
  restore: 'Контрагента відновлено.',
};

/** Side panel of a finance counterparty: view with history and actions, edit, create. */
export function useFinanceCounterpartyEditor(
  initialMode: FinanceCounterpartyEditorMode,
  initial: FinanceCounterparty | null,
  categories: readonly FinanceCategory[],
  onSaved: (message: string) => void,
) {
  const [mode, setMode] = useState(initialMode);
  const [counterparty, setCounterparty] = useState(initial);
  const [values, setValues] = useState(() =>
    createFinanceCounterpartyFormValues(initial, categories),
  );
  const [errors, setErrors] = useState<FinanceCounterpartyFieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [create, createState] = useCreateFinanceCounterpartyMutation();
  const [update, updateState] = useUpdateFinanceCounterpartyMutation();
  const [verify, verifyState] = useVerifyFinanceCounterpartyMutation();
  const [archive, archiveState] = useArchiveFinanceCounterpartyMutation();
  const [restore, restoreState] = useRestoreFinanceCounterpartyMutation();
  const [merge, mergeState] = useMergeFinanceCounterpartyMutation();
  const history = useGetFinanceCounterpartyHistoryQuery(counterparty?.id ?? '', {
    skip: !counterparty || mode !== 'view',
  });
  const saving = createState.isLoading || updateState.isLoading;
  const busy =
    verifyState.isLoading ||
    archiveState.isLoading ||
    restoreState.isLoading ||
    mergeState.isLoading;

  function change<Field extends FinanceCounterpartyField>(
    field: Field,
    value: FinanceCounterpartyFormValues[Field],
  ) {
    setValues((current) => {
      const next = { ...current, [field]: value };
      if (field === 'rootId') return { ...next, subcategoryId: '' };
      return next;
    });
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function save() {
    if (saving || mode === 'view') return;
    const validation = validateFinanceCounterparty(values, counterparty?.verified ?? false);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setMessage(null);
    const body = financeCounterpartyBody(values);
    try {
      if (counterparty)
        await update({
          id: counterparty.id,
          body: { ...body, version: counterparty.version },
        }).unwrap();
      else await create({ ...body, verified: false }).unwrap();
      onSaved(counterparty ? 'Контрагента збережено.' : 'Контрагента додано.');
    } catch (error) {
      if (isAdminApiError(error)) setErrors(error.fieldErrors);
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти контрагента.'));
    }
  }

  async function changeState(action: StateAction) {
    if (!counterparty || busy) return;
    const run = { verify, archive, restore }[action];
    setMessage(null);
    try {
      const saved = await run({ id: counterparty.id, version: counterparty.version }).unwrap();
      setCounterparty(saved);
      setNotice(stateMessages[action]);
    } catch (error) {
      setMessage(adminApiErrorMessage(error, 'Не вдалося змінити контрагента.'));
    }
  }

  /** Moves every operation to `target` and archives this one. */
  async function mergeInto(target: FinanceCounterparty) {
    if (!counterparty || busy) return false;
    setMessage(null);
    try {
      await merge({
        id: counterparty.id,
        version: counterparty.version,
        targetId: target.id,
        targetVersion: target.version,
      }).unwrap();
      onSaved(`«${counterparty.name}» обʼєднано з «${target.name}».`);
      return true;
    } catch (error) {
      setMessage(adminApiErrorMessage(error, 'Не вдалося обʼєднати контрагентів.'));
      return false;
    }
  }

  return {
    mode,
    counterparty,
    values,
    errors,
    message,
    notice,
    saving,
    busy,
    history: {
      entries: history.data ?? [],
      loading: history.isLoading,
      error: history.error
        ? adminApiErrorMessage(history.error, 'Не вдалося завантажити історію.')
        : null,
    },
    change,
    save,
    verify: () => void changeState('verify'),
    archive: () => void changeState('archive'),
    restore: () => void changeState('restore'),
    mergeInto,
    enableEditing: () => {
      if (!counterparty || counterparty.mergedIntoId) return;
      setValues(createFinanceCounterpartyFormValues(counterparty, categories));
      setNotice(null);
      setMode('edit');
    },
  };
}
