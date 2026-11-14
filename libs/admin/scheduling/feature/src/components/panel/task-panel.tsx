import { ReferenceEditorDrawer } from '@admin/references/ui';
import { usePageRights } from '@admin/shared/ui';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import { Button } from '@mui/material';

import { TaskScheduleForm } from './task-schedule-form';
import { TaskView } from './task-view';
import { useScheduleForm } from '../../hooks/use-schedule-form';

import type { TaskNotice } from '../../hooks/use-background-tasks';
import type { ScheduledTask } from '@admin/scheduling/model';

interface Props {
  task: ScheduledTask;
  editing: boolean;
  notice: TaskNotice | null;
  running: boolean;
  onClose: () => void;
  onEdit: () => void;
  onSaved: () => void;
  onRun: (task: ScheduledTask) => void;
}

/** R-03: view with «Запустити зараз» (create) and «Змінити розклад» (edit); neither for the outbox. */
export function TaskPanel({
  task,
  editing,
  notice,
  running,
  onClose,
  onEdit,
  onSaved,
  onRun,
}: Props) {
  const { canCreate } = usePageRights();
  const form = useScheduleForm(task, onSaved);
  const canRun = canCreate && task.editable && !task.isRunning && !task.runRequestedAt;
  return (
    <ReferenceEditorDrawer
      titleId="background-task-title"
      title={task.name}
      description={editing ? 'Змінити розклад' : 'Фонова задача'}
      formId="background-task-schedule"
      paperWidth={480}
      readOnly={!editing}
      saving={form.saving}
      editLabel={task.editable ? 'Змінити розклад' : null}
      readActions={
        canRun && (
          <Button
            variant="outlined"
            startIcon={<PlayArrowOutlinedIcon />}
            disabled={running}
            onClick={() => onRun(task)}
          >
            Запустити зараз
          </Button>
        )
      }
      onClose={onClose}
      onEdit={onEdit}
      onSubmit={form.save}
    >
      {editing ? (
        <TaskScheduleForm
          values={form.values}
          errors={form.errors}
          serverError={form.serverError}
          onChange={form.change}
        />
      ) : (
        <TaskView task={task} notice={notice} />
      )}
    </ReferenceEditorDrawer>
  );
}
