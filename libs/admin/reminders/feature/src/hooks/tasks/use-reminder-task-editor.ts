import {
  useCreateReminderTaskMutation,
  usePreviewReminderDueDatesQuery,
  useUpdateReminderTaskMutation,
} from '@admin/reminders/data-access';
import {
  emptyReminderTaskForm,
  hasReminderTaskErrors,
  reminderFormToInput,
  reminderFormToSchedule,
  reminderTaskToForm,
  validateReminderTaskForm,
} from '@admin/reminders/model';
import { useMemo, useState } from 'react';

import { useDebouncedValue } from './use-debounced-value';
import { reminderError } from '../../errors/reminder-error';

import type {
  ReminderTask,
  ReminderTaskFormErrors,
  ReminderTaskFormValues,
} from '@admin/reminders/model';

type EditorState = { mode: 'create' } | { mode: 'edit'; task: ReminderTask } | null;

/** Dialog state, validation, live deadline preview and save for one task. */
export function useReminderTaskEditor(onSaved: (text: string) => void) {
  const [editor, setEditor] = useState<EditorState>(null);
  const [values, setValues] = useState<ReminderTaskFormValues>(emptyReminderTaskForm);
  const [errors, setErrors] = useState<ReminderTaskFormErrors>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [create, created] = useCreateReminderTaskMutation();
  const [update, updated] = useUpdateReminderTaskMutation();

  const scheduleValid = !hasReminderTaskErrors({
    ...validateReminderTaskForm(values),
    title: undefined,
  });
  const schedule = useMemo(
    () => (scheduleValid ? reminderFormToSchedule(values) : null),
    [scheduleValid, values],
  );
  const debounced = useDebouncedValue(schedule);
  const preview = usePreviewReminderDueDatesQuery(
    {
      schedule: debounced ?? reminderFormToSchedule(emptyReminderTaskForm),
      from: values.activeFrom || null,
    },
    { skip: !editor || !schedule || !debounced },
  );

  const open = (task?: ReminderTask) => {
    setEditor(task ? { mode: 'edit', task } : { mode: 'create' });
    setValues(task ? reminderTaskToForm(task) : emptyReminderTaskForm);
    setErrors({});
    setSaveError(null);
  };
  const close = () => setEditor(null);
  const change = (patch: Partial<ReminderTaskFormValues>) => {
    setValues((current) => ({ ...current, ...patch }));
    setErrors((current) => {
      const next = { ...current };
      for (const key of Object.keys(patch)) delete next[key as keyof ReminderTaskFormErrors];
      return next;
    });
  };
  const save = async () => {
    const found = validateReminderTaskForm(values);
    setErrors(found);
    if (hasReminderTaskErrors(found) || !editor) return;
    setSaveError(null);
    try {
      const input = reminderFormToInput(values);
      if (editor.mode === 'edit') await update({ id: editor.task.id, input }).unwrap();
      else await create(input).unwrap();
      setEditor(null);
      onSaved(editor.mode === 'edit' ? 'Задачу збережено.' : 'Задачу створено.');
    } catch (error) {
      setSaveError(reminderError(error, 'Не вдалося зберегти задачу.'));
    }
  };

  return {
    open,
    close,
    change,
    save,
    dialog: {
      open: !!editor,
      mode: editor?.mode ?? 'create',
      values,
      errors,
      previews: preview.currentData ?? [],
      previewLoading: preview.isFetching,
      saving: created.isLoading || updated.isLoading,
      saveError,
    },
  } as const;
}
