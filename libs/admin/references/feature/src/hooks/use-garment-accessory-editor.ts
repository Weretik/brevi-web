import {
  createGarmentAccessory,
  GarmentAccessoryApiError,
  updateGarmentAccessory,
} from '@admin/references/data-access';
import { useState } from 'react';

import { useSuppliers } from './use-suppliers';
import { validateGarmentAccessory } from '../model/garment-accessory-validation';

import type {
  GarmentAccessoryField,
  GarmentAccessoryFieldErrors,
  GarmentAccessoryFormValues,
} from '../model/garment-accessory-validation';
import type { GarmentAccessory } from '@admin/references/data-access';

export type GarmentAccessoryDialogMode = 'create' | 'view' | 'edit';

function initialValues(
  accessory: GarmentAccessory | null,
  nextId: number,
): GarmentAccessoryFormValues {
  return {
    id: String(accessory?.id ?? nextId),
    name: accessory?.name ?? '',
    supplierName: accessory?.supplierName ?? '',
    price: accessory ? String(accessory.price) : '',
  };
}

export function useGarmentAccessoryEditor(
  initialMode: GarmentAccessoryDialogMode,
  accessory: GarmentAccessory | null,
  nextId: number,
  onSaved: () => void,
) {
  const [mode, setMode] = useState(initialMode);
  const [values, setValues] = useState(() => initialValues(accessory, nextId));
  const [errors, setErrors] = useState<GarmentAccessoryFieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { rows: suppliers, error: supplierError, reload: retrySuppliers } = useSuppliers();

  function change(field: GarmentAccessoryField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function save() {
    if (saving || mode === 'view') return;
    const validation = validateGarmentAccessory(values);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setSaving(true);
    setMessage(null);
    try {
      const body = {
        name: values.name.trim(),
        supplierName: values.supplierName,
        price: Number(values.price),
      };
      if (mode === 'create') await createGarmentAccessory({ id: Number(values.id), ...body });
      else await updateGarmentAccessory(Number(values.id), body);
      onSaved();
    } catch (error) {
      if (error instanceof GarmentAccessoryApiError) setErrors(error.fieldErrors);
      setMessage(error instanceof Error ? error.message : 'Не вдалося зберегти фурнітуру.');
    } finally {
      setSaving(false);
    }
  }

  return {
    mode,
    values,
    errors,
    message,
    saving,
    suppliers,
    supplierError,
    change,
    save,
    retrySuppliers,
    enableEditing: () => setMode('edit'),
  };
}
