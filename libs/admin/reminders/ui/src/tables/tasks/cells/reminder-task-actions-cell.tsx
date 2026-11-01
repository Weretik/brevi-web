import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { IconButton, Stack, Tooltip } from '@mui/material';

import type { ReminderTask } from '@admin/reminders/model';

interface Props {
  task: ReminderTask;
  onEdit: (task: ReminderTask) => void;
  onArchive: (task: ReminderTask) => void;
}

export function ReminderTaskActionsCell({ task, onEdit, onArchive }: Props) {
  return (
    <Stack direction="row" spacing={0.5}>
      <Tooltip title="Редагувати">
        <IconButton
          size="small"
          aria-label={`Редагувати «${task.title}»`}
          onClick={() => onEdit(task)}
        >
          <EditOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Видалити">
        <IconButton
          size="small"
          aria-label={`Видалити «${task.title}»`}
          onClick={() => onArchive(task)}
        >
          <DeleteOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
