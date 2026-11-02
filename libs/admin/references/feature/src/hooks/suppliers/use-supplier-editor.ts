import {
  useCreateSupplierMutation,
  useUpdateSupplierBreviFieldsMutation,
  useUpdateSupplierMutation,
} from '@admin/references/data-access';
import {
  createSupplierDraft,
  isKeepinCrmSupplier,
  validateSupplier,
} from '@admin/references/model';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';
import { useState } from 'react';

import type {
  SupplierField,
  SupplierFieldErrors,
  Supplier,
  SupplierDraft,
  SupplierDialogMode,
} from '@admin/references/model';

export function useSupplierEditor(
  initialMode: SupplierDialogMode,
  supplier: Supplier | null,
  nextId: number,
  onSaved: () => void,
) {
  const [mode, setMode] = useState<SupplierDialogMode>(initialMode);
  const [draft, setDraft] = useState<SupplierDraft>(() => createSupplierDraft(supplier, nextId));
  const [errors, setErrors] = useState<SupplierFieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [createSupplier, createState] = useCreateSupplierMutation();
  const [updateSupplier, updateState] = useUpdateSupplierMutation();
  const [updateBreviFields, breviFieldsState] = useUpdateSupplierBreviFieldsMutation();
  const saving = createState.isLoading || updateState.isLoading || breviFieldsState.isLoading;
  const fromKeepinCrm = isKeepinCrmSupplier(supplier);

  function change(field: SupplierField, value: string | boolean) {
    setDraft((current) => ({ ...current, [field]: field === 'id' ? Number(value) : value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function save() {
    if (saving || mode === 'view') return;
    // A KeepinCRM card is read-only here: only the notes typed in Brevi are checked.
    const { notes } = validateSupplier(draft);
    const validation = fromKeepinCrm ? (notes ? { notes } : {}) : validateSupplier(draft);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setMessage(null);
    try {
      if (mode === 'create') await createSupplier(draft).unwrap();
      else if (fromKeepinCrm) await updateBreviFields(draft).unwrap();
      else await updateSupplier(draft).unwrap();
      onSaved();
    } catch (error) {
      if (isAdminApiError(error)) setErrors(error.fieldErrors);
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти постачальника.'));
    }
  }

  return {
    mode,
    draft,
    errors,
    message,
    saving,
    change,
    save,
    enableEditing: () => setMode('edit'),
  };
}
