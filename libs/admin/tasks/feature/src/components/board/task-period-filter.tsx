import { ReferenceFilterChip } from '@admin/references/ui';
import { taskBoardPeriods } from '@admin/tasks/model';
import { Stack, Typography } from '@mui/material';

import type { TaskBoardPeriod } from '@admin/tasks/model';

interface Props {
  selected: TaskBoardPeriod;
  onSelect: (period: TaskBoardPeriod) => void;
}

/** «Період» of «Мої завдання»: narrows the «Виконано» column; open tasks always stay on the board. */
export function TaskPeriodFilter({ selected, onSelect }: Props) {
  return (
    <Stack
      direction="row"
      role="group"
      aria-label="Період"
      sx={{ flexWrap: 'wrap', gap: 1, mb: 2, alignItems: 'center' }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mr: 0.5 }}>
        Виконані за:
      </Typography>
      {taskBoardPeriods.map(({ period, label }) => (
        <ReferenceFilterChip
          key={period}
          label={label}
          selected={selected === period}
          onClick={() => onSelect(period)}
        />
      ))}
    </Stack>
  );
}
