import {
  useGetScheduledTasksQuery,
  useRunScheduledTaskNowMutation,
} from '@admin/scheduling/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { ScheduledTask } from '@admin/scheduling/model';

export interface TaskNotice {
  text: string;
  ok: boolean;
}

/** R-05: the list is refreshed every 30 seconds so a run's result appears without reloading. */
export const tasksRefreshMs = 30_000;

/** «Фонові задачі»: the list, the open side panel and «Запустити зараз». */
export function useBackgroundTasks() {
  const query = useGetScheduledTasksQuery(undefined, { pollingInterval: tasksRefreshMs });
  const [runNow, running] = useRunScheduledTaskNowMutation();
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState<TaskNotice | null>(null);
  const tasks = query.data ?? [];

  function open(task: ScheduledTask) {
    setOpenKey(task.key);
    setEditing(false);
    setNotice(null);
  }

  function close() {
    setOpenKey(null);
    setEditing(false);
    setNotice(null);
  }

  async function run(task: ScheduledTask) {
    setNotice(null);
    try {
      await runNow(task.key).unwrap();
      setNotice({ text: 'Запуск заплановано: задача почнеться протягом хвилини.', ok: true });
    } catch (error) {
      setNotice({ text: adminApiErrorMessage(error, 'Не вдалося запустити задачу.'), ok: false });
    }
  }

  return {
    tasks,
    loading: query.isLoading,
    error: query.error ? adminApiErrorMessage(query.error, 'Не вдалося завантажити задачі.') : null,
    reload: query.refetch,
    openTask: tasks.find((task) => task.key === openKey) ?? null,
    editing,
    notice,
    running: running.isLoading,
    open,
    close,
    edit: () => setEditing(true),
    saved: () => {
      setEditing(false);
      setNotice({ text: 'Розклад збережено.', ok: true });
    },
    run,
  };
}
