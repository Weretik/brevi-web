import {
  useCreateProductSectionMutation,
  useUpdateProductSectionMutation,
} from '@admin/references/data-access';
import {
  createProductSectionFormValues,
  productSectionBody,
  validateProductSection,
} from '@admin/references/model';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';
import { useState } from 'react';

import type {
  PricingEditorMode,
  ProductSection,
  ProductSectionField,
  ProductSectionFieldErrors,
  ProductSectionFormValues,
  ProductSectionType,
} from '@admin/references/model';

export function useProductSectionEditor(
  initialMode: PricingEditorMode,
  section: ProductSection | null,
  newType: ProductSectionType,
  newSortOrder: number,
  onSaved: () => void,
) {
  const [mode, setMode] = useState(initialMode);
  const [values, setValues] = useState(() => createProductSectionFormValues(section, newType));
  const [errors, setErrors] = useState<ProductSectionFieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [create, createState] = useCreateProductSectionMutation();
  const [update, updateState] = useUpdateProductSectionMutation();
  const saving = createState.isLoading || updateState.isLoading;

  function change<Field extends ProductSectionField>(
    field: Field,
    value: ProductSectionFormValues[Field],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function save() {
    if (saving || mode === 'view') return;
    const validation = validateProductSection(values);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setMessage(null);
    try {
      const body = productSectionBody(values, section?.sortOrder ?? newSortOrder);
      if (section) await update({ id: section.id, body }).unwrap();
      else await create(body).unwrap();
      onSaved();
    } catch (error) {
      if (isAdminApiError(error)) setErrors(error.fieldErrors);
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти розділ.'));
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
