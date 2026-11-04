import { ReferenceFilterChip } from '@admin/references/ui';
import { Stack } from '@mui/material';

import type { TaskAssignee } from '@admin/tasks/model';

interface Props {
  assignees: readonly TaskAssignee[];
  selectedUserId: number | null;
  onSelect: (userId: number | null) => void;
}

/** Director and Admin switch the board between all managers and one of them (R-02). */
export function TaskManagerFilter({ assignees, selectedUserId, onSelect }: Props) {
  return (
    <Stack
      direction="row"
      role="group"
      aria-label="Менеджер"
      sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}
    >
      <ReferenceFilterChip
        label="Усі менеджери"
        selected={selectedUserId === null}
        onClick={() => onSelect(null)}
      />
      {assignees.map((assignee) => (
        <ReferenceFilterChip
          key={assignee.userId}
          label={assignee.name}
          selected={selectedUserId === assignee.userId}
          onClick={() => onSelect(assignee.userId)}
        />
      ))}
    </Stack>
  );
}
