import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { Box } from '@mui/material';

import { TasksSummary } from './tasks-summary';
import { TaskPanel } from '../components/panel/task-panel';
import { BackgroundTasksTable } from '../components/table/background-tasks-table';
import { useBackgroundTasks } from '../hooks/use-background-tasks';

/**
 * «Адміністрування › Фонові задачі»: every background task, its schedule and last results; a row
 * opens the side panel with history, «Запустити зараз» and «Змінити розклад».
 */
export function BackgroundTasksPage() {
  const page = useBackgroundTasks();
  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Адміністрування"
        title="Фонові задачі"
        subtitle={<TasksSummary tasks={page.tasks} />}
        actions={null}
      />
      <ReferenceListAlerts
        error={page.error}
        loading={page.loading}
        onRetry={() => void page.reload()}
        actionMessage={null}
        onCloseActionMessage={() => undefined}
      />
      {!page.error && (
        <BackgroundTasksTable tasks={page.tasks} loading={page.loading} onOpen={page.open} />
      )}
      {page.openTask && (
        <TaskPanel
          key={page.openTask.key}
          task={page.openTask}
          editing={page.editing}
          notice={page.notice}
          running={page.running}
          onClose={page.close}
          onEdit={page.edit}
          onSaved={page.saved}
          onRun={(task) => void page.run(task)}
        />
      )}
    </Box>
  );
}

export default BackgroundTasksPage;
