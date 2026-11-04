import {
  useCreateWorkshopEmployeeMutation,
  useUpdateWorkshopEmployeeMutation,
} from '@admin/production/data-access';
import {
  createWorkshopEmployeeDraft,
  validateWorkshopEmployee,
  workshopEmployeeBody,
} from '@admin/production/model';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';
import { useState } from 'react';

import type {
  WorkshopEmployee,
  WorkshopEmployeeErrors,
  WorkshopEmployeeField,
} from '@admin/production/model';

export type ProductionEditorMode = 'create' | 'view' | 'edit';

export function useWorkshopEmployeeEditor(
  initialMode: ProductionEditorMode,
  employee: WorkshopEmployee | null,
  onSaved: (employee: WorkshopEmployee) => void,
) {
  const [mode, setMode] = useState(initialMode);
  const [values, setValues] = useState(() => createWorkshopEmployeeDraft(employee));
  const [errors, setErrors] = useState<WorkshopEmployeeErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [create, createState] = useCreateWorkshopEmployeeMutation();
  const [update, updateState] = useUpdateWorkshopEmployeeMutation();
  const saving = createState.isLoading || updateState.isLoading;

  function change(field: WorkshopEmployeeField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function save() {
    if (saving || mode === 'view') return;
    const validation = validateWorkshopEmployee(values);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setMessage(null);
    try {
      const draft = workshopEmployeeBody(values);
      const saved = employee
        ? await update({ id: employee.id, draft }).unwrap()
        : await create(draft).unwrap();
      onSaved(saved);
    } catch (error) {
      if (isAdminApiError(error)) setErrors(error.fieldErrors);
      setMessage(adminApiErrorMessage(error, 'Не вдалося зберегти працівника.'));
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
