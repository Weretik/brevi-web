import {
  AdditionalReferenceApiError,
  updateAdditionalReference,
} from '@admin/references/data-access';
import { useState } from 'react';

import {
  isAdditionalReferenceUnit,
  validateAdditionalReference,
} from '../model/additional-reference-validation';

import type {
  AdditionalReferenceDraft,
  AdditionalReferenceField,
  AdditionalReferenceFieldErrors,
} from '../model/additional-reference-validation';
import type { AdditionalReference } from '@admin/references/data-access';

export function useAdditionalReferenceEditor(reference: AdditionalReference, onSaved: () => void) {
  const [draft, setDraft] = useState<AdditionalReferenceDraft>({
    ...reference,
    value: String(reference.value),
  });
  const [errors, setErrors] = useState<AdditionalReferenceFieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function change(field: AdditionalReferenceField, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function save() {
    if (saving) return;
    const validation = validateAdditionalReference(draft);
    setErrors(validation);
    if (Object.keys(validation).length || !isAdditionalReferenceUnit(draft.unit)) return;
    setSaving(true);
    setMessage(null);
    try {
      await updateAdditionalReference(draft.id, {
        name: draft.name.trim(),
        key: draft.key.trim(),
        value: Number(draft.value),
        unit: draft.unit,
        description: draft.description?.trim() || null,
      });
      onSaved();
    } catch (error) {
      if (error instanceof AdditionalReferenceApiError) setErrors(error.fieldErrors);
      setMessage(error instanceof Error ? error.message : 'Не вдалося зберегти запис.');
    } finally {
      setSaving(false);
    }
  }
  return { draft, errors, message, saving, change, save };
}
