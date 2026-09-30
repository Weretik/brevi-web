import {
  createGarmentPartOperation,
  GarmentPartOperationApiError,
  updateGarmentPartOperation,
} from '@admin/references/data-access';
import { useState } from 'react';

import { validateGarmentPartOperation } from '../model/garment-part-operation-validation';

import type {
  GarmentPartOperationDraft,
  GarmentPartOperationField,
  GarmentPartOperationFieldErrors,
} from '../model/garment-part-operation-validation';
import type { GarmentPartOperation } from '@admin/references/data-access';

export type GarmentPartOperationDialogMode = 'create' | 'view' | 'edit';

export function useGarmentPartOperationEditor(
  initialMode: GarmentPartOperationDialogMode,
  operation: GarmentPartOperation | null,
  nextId: number,
  onSaved: () => void,
) {
  const [mode, setMode] = useState(initialMode);
  const [draft, setDraft] = useState<GarmentPartOperationDraft>({
    id: operation?.id ?? nextId,
    garmentPartName: operation?.garmentPartName ?? '',
    name: operation?.name ?? '',
    min: operation ? String(operation.min) : '0',
  });
  const [errors, setErrors] = useState<GarmentPartOperationFieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function change(field: GarmentPartOperationField, value: string) {
    setDraft((current) => ({ ...current, [field]: field === 'id' ? Number(value) : value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function save() {
    if (saving || mode === 'view') return;
    const validation = validateGarmentPartOperation(draft);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setSaving(true);
    setMessage(null);
    try {
      const body = {
        garmentPartName: draft.garmentPartName.trim(),
        name: draft.name.trim(),
        min: Number(draft.min),
      };
      if (mode === 'create') await createGarmentPartOperation({ id: draft.id, ...body });
      else await updateGarmentPartOperation(draft.id, body);
      onSaved();
    } catch (error) {
      if (error instanceof GarmentPartOperationApiError) setErrors(error.fieldErrors);
      setMessage(error instanceof Error ? error.message : 'Не вдалося зберегти роботу.');
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
