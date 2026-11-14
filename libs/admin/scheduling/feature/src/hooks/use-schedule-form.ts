import { useUpdateScheduledTaskScheduleMutation } from '@admin/scheduling/data-access';
import { scheduleFormOf, scheduleInputOf, validateScheduleForm } from '@admin/scheduling/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type {
  ScheduleFormErrors,
  ScheduleFormValues,
  ScheduledTask,
} from '@admin/scheduling/model';

/** «Змінити розклад»: checks the fields first, then shows the backend's reason as is (R-04). */
export function useScheduleForm(task: ScheduledTask, onSaved: () => void) {
  const [values, setValues] = useState<ScheduleFormValues>(() => scheduleFormOf(task));
  const [errors, setErrors] = useState<ScheduleFormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [update, state] = useUpdateScheduledTaskScheduleMutation();

  function change(changes: Partial<ScheduleFormValues>) {
    setValues((current) => ({ ...current, ...changes }));
  }

  async function save() {
    const found = validateScheduleForm(values, new Date());
    setErrors(found);
    setServerError(null);
    if (Object.keys(found).length > 0) return;
    try {
      await update({ key: task.key, input: scheduleInputOf(values) }).unwrap();
      onSaved();
    } catch (error) {
      setServerError(adminApiErrorMessage(error, 'Не вдалося зберегти розклад.'));
    }
  }

  return { values, errors, serverError, saving: state.isLoading, change, save };
}
