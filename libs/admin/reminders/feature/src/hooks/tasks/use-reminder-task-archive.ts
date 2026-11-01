import { useArchiveReminderTaskMutation } from '@admin/reminders/data-access';
import { useState } from 'react';

import { reminderError } from '../../errors/reminder-error';

import type { ReminderTask } from '@admin/reminders/model';

export function useReminderTaskArchive(notify: {
  success: (text: string) => void;
  failure: (text: string) => void;
}) {
  const [target, setTarget] = useState<ReminderTask | null>(null);
  const [archive, state] = useArchiveReminderTaskMutation();
  const confirm = async () => {
    if (!target) return;
    try {
      await archive(target.id).unwrap();
      notify.success(`Задачу «${target.title}» видалено. Історія періодів збережена.`);
      setTarget(null);
    } catch (error) {
      notify.failure(reminderError(error, 'Не вдалося видалити задачу.'));
    }
  };
  return { target, ask: setTarget, cancel: () => setTarget(null), confirm, busy: state.isLoading };
}
