import { createSupplier, SupplierApiError, updateSupplier } from '@admin/references/data-access';
import { useState } from 'react';

import { validateSupplier } from '../model/supplier-validation';

import type { SupplierField, SupplierFieldErrors } from '../model/supplier-validation';
import type { Supplier, SupplierDraft } from '@admin/references/data-access';

export type SupplierDialogMode = 'create' | 'view' | 'edit';

function initialDraft(supplier: Supplier | null, nextId: number): SupplierDraft {
  return {
    id: supplier?.id ?? nextId,
    name: supplier?.name ?? '',
    link: supplier?.link ?? '',
    contactPerson: supplier?.contactPerson ?? '',
    phoneNumber: supplier?.phoneNumber ?? '',
    notes: supplier?.notes ?? '',
  };
}

export function useSupplierEditor(
  initialMode: SupplierDialogMode,
  supplier: Supplier | null,
  nextId: number,
  onSaved: () => void,
) {
  const [mode, setMode] = useState<SupplierDialogMode>(initialMode);
  const [draft, setDraft] = useState<SupplierDraft>(() => initialDraft(supplier, nextId));
  const [errors, setErrors] = useState<SupplierFieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function change(field: SupplierField, value: string) {
    setDraft((current) => ({ ...current, [field]: field === 'id' ? Number(value) : value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function save() {
    if (saving || mode === 'view') return;
    const validation = validateSupplier(draft);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setSaving(true);
    setMessage(null);
    try {
      if (mode === 'create') await createSupplier(draft);
      else await updateSupplier(draft);
      onSaved();
    } catch (error) {
      if (error instanceof SupplierApiError) setErrors(error.fieldErrors);
      setMessage(error instanceof Error ? error.message : 'Не вдалося зберегти постачальника.');
    } finally {
      setSaving(false);
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
