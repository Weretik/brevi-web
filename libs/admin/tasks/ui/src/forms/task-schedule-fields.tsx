import { Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

import type { TaskFormErrors, TaskFormValues } from '@admin/tasks/model';

interface Props {
  values: TaskFormValues;
  error: (field: keyof TaskFormErrors) => string | undefined;
  disabled: boolean;
  onChange: (patch: Partial<TaskFormValues>) => void;
}

/** «Термін» (date and time) and «Пріоритет». */
export function TaskScheduleFields({ values, error, disabled, onChange: set }: Props) {
  return (
    <>
      <Stack direction="row" sx={{ gap: 1.5 }}>
        <TextField
          label="Термін"
          type="date"
          required
          fullWidth
          value={values.dueDate}
          disabled={disabled}
          error={Boolean(error('due'))}
          helperText={error('due')}
          slotProps={{ inputLabel: { shrink: true } }}
          onChange={(event) => set({ dueDate: event.target.value })}
        />
        <TextField
          label="Час"
          type="time"
          required
          value={values.dueTime}
          disabled={disabled}
          error={Boolean(error('due'))}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ width: 140, flex: 'none' }}
          onChange={(event) => set({ dueTime: event.target.value })}
        />
      </Stack>
      <Stack sx={{ gap: 0.75 }}>
        <Typography variant="subtitle2" component="p" color="text.secondary" id="task-priority">
          Пріоритет
        </Typography>
        <ToggleButtonGroup
          exclusive
          fullWidth
          size="small"
          aria-labelledby="task-priority"
          value={values.isUrgent ? 'urgent' : 'normal'}
          disabled={disabled}
          onChange={(_event, value: 'urgent' | 'normal' | null) => {
            if (value) set({ isUrgent: value === 'urgent' });
          }}
        >
          <ToggleButton value="normal">Звичайний</ToggleButton>
          <ToggleButton
            value="urgent"
            sx={{ '&.Mui-selected': { bgcolor: 'error.light', color: 'error.main' } }}
          >
            Терміново
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </>
  );
}
