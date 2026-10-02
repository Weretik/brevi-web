import { useUpdateAdditionalReferenceMutation } from '@admin/references/data-access';
import { isAdditionalReferenceUnit, validateAdditionalReference } from '@admin/references/model';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';
import { useState } from 'react';

import type {
  AdditionalReferenceDraft,
  AdditionalReferenceField,
  AdditionalReferenceFieldErrors,
  AdditionalReference,
} from '@admin/references/model';

export function useAdditionalReferenceEditor(reference: AdditionalReference, onSaved: () => void) {
  const [draft, setDraft] = useState<AdditionalReferenceDraft>({
    ...reference,
    value: String(reference.value),
  });
  const [errors, setErrors] = useState<AdditionalReferenceFieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [updateAdditionalReference, updateState] = useUpdateAdditionalReferenceMutation();
  const saving = updateState.isLoading;

  function change(field: AdditionalReferenceField, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function save() {
    if (saving) return;
    const validation = validateAdditionalReference(draft);
    setErrors(validation);
    if (Object.keys(validation).length || !isAdditionalReferenceUnit(draft.unit)) return;
    setMessage(null);
    try {
      await updateAdditionalReference({
        id: draft.id,
        body: {
          name: draft.name.trim(),
          key: draft.key.trim(),
          value: Number(draft.value),
          unit: draft.unit,
          description: draft.description?.trim() || null,
        },
      }).unwrap();
      onSaved();
    } catch (error) {
      if (isAdminApiError(error)) setErrors(error.fieldErrors);
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти запис.'));
    }
  }
  return { draft, errors, message, saving, change, save };
}
