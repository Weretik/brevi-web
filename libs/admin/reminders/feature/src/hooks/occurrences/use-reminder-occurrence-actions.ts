import {
  useCloseReminderOccurrenceMutation,
  useReopenReminderOccurrenceMutation,
} from '@admin/reminders/data-access';
import { useState } from 'react';

import { reminderError } from '../../errors/reminder-error';

import type { ReminderOccurrence } from '@admin/reminders/model';

interface Notify {
  success: (text: string) => void;
  failure: (text: string) => void;
}

/** Admin close/reopen of one period, and the history dialog target. */
export function useReminderOccurrenceActions(notify: Notify) {
  const [busyId, setBusyId] = useState<number | null>(null);
  const [history, setHistory] = useState<ReminderOccurrence | null>(null);
  const [close] = useCloseReminderOccurrenceMutation();
  const [reopen] = useReopenReminderOccurrenceMutation();

  const run = async (occurrence: ReminderOccurrence, action: 'close' | 'reopen') => {
    setBusyId(occurrence.id);
    try {
      if (action === 'close') await close(occurrence.id).unwrap();
      else await reopen(occurrence.id).unwrap();
      notify.success(
        action === 'close'
          ? `«${occurrence.taskTitle}» за ${occurrence.period} позначено виконаним.`
          : `«${occurrence.taskTitle}» за ${occurrence.period} знову активне.`,
      );
    } catch (error) {
      notify.failure(reminderError(error));
    } finally {
      setBusyId(null);
    }
  };

  return {
    busyId,
    history,
    showHistory: setHistory,
    hideHistory: () => setHistory(null),
    closeOccurrence: (occurrence: ReminderOccurrence) => run(occurrence, 'close'),
    reopenOccurrence: (occurrence: ReminderOccurrence) => run(occurrence, 'reopen'),
  };
}
