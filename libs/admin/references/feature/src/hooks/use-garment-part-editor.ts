import {
  createGarmentPart,
  GarmentPartApiError,
  updateGarmentPart,
} from '@admin/references/data-access';
import { useState } from 'react';

import { validateGarmentPart } from '../model/garment-part-validation';

import type {
  GarmentPartDraft,
  GarmentPartField,
  GarmentPartFieldErrors,
} from '../model/garment-part-validation';
import type { GarmentPart } from '@admin/references/data-access';

export type GarmentPartDialogMode = 'create' | 'view' | 'edit';

export function useGarmentPartEditor(
  initialMode: GarmentPartDialogMode,
  garmentPart: GarmentPart | null,
  nextId: number,
  onSaved: () => void,
) {
  const [mode, setMode] = useState(initialMode);
  const [draft, setDraft] = useState<GarmentPartDraft>({
    id: garmentPart?.id ?? nextId,
    name: garmentPart?.name ?? '',
  });
  const [errors, setErrors] = useState<GarmentPartFieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function change(field: GarmentPartField, value: string) {
    setDraft((current) => ({ ...current, [field]: field === 'id' ? Number(value) : value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function save() {
    if (saving || mode === 'view') return;
    const validation = validateGarmentPart(draft);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setSaving(true);
    setMessage(null);
    try {
      if (mode === 'create') await createGarmentPart({ id: draft.id, name: draft.name.trim() });
      else await updateGarmentPart(draft.id, { name: draft.name.trim() });
      onSaved();
    } catch (error) {
      if (error instanceof GarmentPartApiError) setErrors(error.fieldErrors);
      setMessage(error instanceof Error ? error.message : 'Не вдалося зберегти елемент виробу.');
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
