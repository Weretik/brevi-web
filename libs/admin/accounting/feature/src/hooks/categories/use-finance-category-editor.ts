import {
  useCreateFinanceCategoryMutation,
  useGetFinanceCategoryHistoryQuery,
  useUpdateFinanceCategoryMutation,
} from '@admin/accounting/data-access';
import {
  createFinanceCategoryFormValues,
  financeCategoryCreateBody,
  financeCategoryUpdateBody,
  validateFinanceCategory,
} from '@admin/accounting/model';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';
import { useState } from 'react';

import type {
  CategoryDirection,
  FinanceCategoryField,
  FinanceCategoryFieldErrors,
  FinanceCategoryFormValues,
  FinanceCategoryRow,
  LedgerScope,
} from '@admin/accounting/model';

export type FinanceCategoryEditorMode = 'create' | 'view' | 'edit';

export function useFinanceCategoryEditor(
  initialMode: FinanceCategoryEditorMode,
  category: FinanceCategoryRow | null,
  scope: LedgerScope,
  direction: CategoryDirection,
  newParentId: string | null,
  newSortOrder: number,
  onSaved: (message: string) => void,
) {
  const [mode, setMode] = useState(initialMode);
  const [values, setValues] = useState(() =>
    createFinanceCategoryFormValues(category, direction, newParentId),
  );
  const [errors, setErrors] = useState<FinanceCategoryFieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [create, createState] = useCreateFinanceCategoryMutation();
  const [update, updateState] = useUpdateFinanceCategoryMutation();
  const history = useGetFinanceCategoryHistoryQuery(category?.id ?? '', {
    skip: !category || mode !== 'view',
  });
  const saving = createState.isLoading || updateState.isLoading;

  function change<Field extends FinanceCategoryField>(
    field: Field,
    value: FinanceCategoryFormValues[Field],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function save() {
    if (saving || mode === 'view') return;
    const validation = validateFinanceCategory(values);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setMessage(null);
    try {
      if (category)
        await update({
          id: category.id,
          body: financeCategoryUpdateBody(values, category),
        }).unwrap();
      else await create(financeCategoryCreateBody(values, scope, newSortOrder)).unwrap();
      onSaved(category ? 'Категорію збережено.' : 'Категорію додано.');
    } catch (error) {
      if (isAdminApiError(error)) setErrors(error.fieldErrors);
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти категорію.'));
    }
  }

  return {
    mode,
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
    enableEditing: () => setMode('edit'),
  };
}
