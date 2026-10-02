import {
  useCreateGarmentPartMutation,
  useUpdateGarmentPartMutation,
} from '@admin/references/data-access';
import { validateGarmentPart } from '@admin/references/model';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';
import { useState } from 'react';

import type {
  GarmentPartDraft,
  GarmentPartField,
  GarmentPartFieldErrors,
  GarmentPart,
} from '@admin/references/model';

export type GarmentPartEditorMode = 'create' | 'view' | 'edit';

export function useGarmentPartEditor(
  initialMode: GarmentPartEditorMode,
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
  const [createGarmentPart, createState] = useCreateGarmentPartMutation();
  const [updateGarmentPart, updateState] = useUpdateGarmentPartMutation();
  const saving = createState.isLoading || updateState.isLoading;

  function change(field: GarmentPartField, value: string) {
    setDraft((current) => ({ ...current, [field]: field === 'id' ? Number(value) : value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function save() {
    if (saving || mode === 'view') return;
    const validation = validateGarmentPart(draft);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setMessage(null);
    try {
      if (mode === 'create')
        await createGarmentPart({ id: draft.id, name: draft.name.trim() }).unwrap();
      else await updateGarmentPart({ id: draft.id, body: { name: draft.name.trim() } }).unwrap();
      onSaved();
    } catch (error) {
      if (isAdminApiError(error)) setErrors(error.fieldErrors);
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти елемент виробу.'));
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
