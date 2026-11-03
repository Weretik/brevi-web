import { useUpdateProductOverviewMutation } from '@admin/products/data-access';
import {
  createProductOverviewFormValues,
  productOverviewBody,
  validateProductOverview,
} from '@admin/products/model';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';
import { useState } from 'react';

import type {
  ProductOverview,
  ProductOverviewField,
  ProductOverviewFieldErrors,
  ProductOverviewFormValues,
} from '@admin/products/model';

export type ProductOverviewEditorMode = 'view' | 'edit';

export function useProductOverviewEditor(
  initialMode: ProductOverviewEditorMode,
  row: ProductOverview,
  onSaved: () => void,
) {
  const [mode, setMode] = useState(initialMode);
  const [values, setValues] = useState(() => createProductOverviewFormValues(row));
  const [errors, setErrors] = useState<ProductOverviewFieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [update, updateState] = useUpdateProductOverviewMutation();
  const saving = updateState.isLoading;

  function change<Field extends ProductOverviewField>(
    field: Field,
    value: ProductOverviewFormValues[Field],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function save() {
    if (saving || mode === 'view') return;
    const validation = validateProductOverview(values, row.type);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setMessage(null);
    try {
      await update({ id: row.id, body: productOverviewBody(values, row) }).unwrap();
      onSaved();
    } catch (error) {
      if (isAdminApiError(error)) setErrors(error.fieldErrors);
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти товар.'));
    }
  }

  return {
    mode,
    values,
    errors,
    message,
    saving,
    change,
    save,
    enableEditing: () => setMode('edit'),
  };
}
