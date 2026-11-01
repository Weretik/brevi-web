import {
  useAddNonWorkingDayMutation,
  useRemoveNonWorkingDayMutation,
} from '@admin/reminders/data-access';
import { formatReminderDate } from '@admin/reminders/model';
import { useState } from 'react';

import { reminderError } from '../../errors/reminder-error';

import type { NonWorkingDay } from '@admin/reminders/model';

interface Notify {
  success: (text: string) => void;
  failure: (text: string) => void;
}

export function useNonWorkingDayActions(notify: Notify) {
  const [removing, setRemoving] = useState<NonWorkingDay | null>(null);
  const [add, added] = useAddNonWorkingDayMutation();
  const [remove, removed] = useRemoveNonWorkingDayMutation();

  const addDay = async (day: NonWorkingDay): Promise<boolean> => {
    try {
      await add(day).unwrap();
      notify.success(`${formatReminderDate(day.date)} тепер неробочий день.`);
      return true;
    } catch (error) {
      notify.failure(reminderError(error, 'Не вдалося додати день.'));
      return false;
    }
  };
  const confirmRemove = async () => {
    if (!removing) return;
    try {
      await remove(removing.date).unwrap();
      notify.success(`${formatReminderDate(removing.date)} знову робочий день.`);
      setRemoving(null);
    } catch (error) {
      notify.failure(reminderError(error, 'Не вдалося прибрати день.'));
    }
  };
  return {
    adding: added.isLoading,
    removing,
    removingBusy: removed.isLoading,
    askRemove: setRemoving,
    cancelRemove: () => setRemoving(null),
    confirmRemove,
    addDay,
  };
}
