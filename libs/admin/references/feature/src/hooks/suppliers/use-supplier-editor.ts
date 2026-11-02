import {
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
} from '@admin/references/data-access';
import { createSupplierDraft, validateSupplier } from '@admin/references/model';
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
  const saving = createState.isLoading || updateState.isLoading;

  function change(field: SupplierField, value: string) {
    setDraft((current) => ({ ...current, [field]: field === 'id' ? Number(value) : value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function save() {
    if (saving || mode === 'view') return;
    const validation = validateSupplier(draft);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setMessage(null);
    try {
      if (mode === 'create') await createSupplier(draft).unwrap();
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
