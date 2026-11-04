import { taskLimits } from '@admin/tasks/model';
import {
  Autocomplete,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';

import { TaskStepsEditor } from './task-steps-editor';

import type {
  TaskAssignee,
  TaskCustomerOption,
  TaskFormErrors,
  TaskFormValues,
} from '@admin/tasks/model';

interface Props {
  values: TaskFormValues;
  errors: TaskFormErrors;
  /** Shown only after the first save attempt, like other side panels. */
  showErrors: boolean;
  disabled: boolean;
  assignees: readonly TaskAssignee[];
  customers: readonly TaskCustomerOption[];
  onCustomerSearch: (text: string) => void;
  onChange: (values: TaskFormValues) => void;
}

/** The side panel form of Director or Admin (TSK-001 R-03). */
export function TaskFormFields({
  values,
  errors,
  showErrors,
  disabled,
  assignees,
  customers,
  onCustomerSearch,
  onChange,
}: Props) {
  const set = (patch: Partial<TaskFormValues>) => onChange({ ...values, ...patch });
  const error = (field: keyof TaskFormErrors) => (showErrors ? errors[field] : undefined);

  return (
    <Stack sx={{ gap: 2 }}>
      <TextField
        label="Що зробити"
        required
        autoFocus
        value={values.title}
        disabled={disabled}
        error={Boolean(error('title'))}
        helperText={error('title')}
        slotProps={{ htmlInput: { maxLength: taskLimits.title } }}
        onChange={(event) => set({ title: event.target.value })}
      />
      <TextField
        label="Опис"
        multiline
        minRows={3}
        value={values.description}
        disabled={disabled}
        error={Boolean(error('description'))}
        helperText={error('description')}
        slotProps={{ htmlInput: { maxLength: taskLimits.description } }}
        onChange={(event) => set({ description: event.target.value })}
      />
      <TextField
        select
        label="Менеджер"
        required
        value={values.assigneeUserId ?? ''}
        disabled={disabled}
        error={Boolean(error('assigneeUserId'))}
        helperText={
          error('assigneeUserId') ??
          (assignees.length === 0 ? 'Немає активних користувачів з роллю «Менеджер».' : undefined)
        }
        onChange={(event) => set({ assigneeUserId: Number(event.target.value) })}
      >
        {assignees.map((assignee) => (
          <MenuItem key={assignee.userId} value={assignee.userId}>
            {assignee.name}
          </MenuItem>
        ))}
      </TextField>
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
      <Autocomplete
        options={customers as TaskCustomerOption[]}
        value={values.customer}
        disabled={disabled}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.publicId === value.publicId}
        filterOptions={(options) => options}
        noOptionsText="Почніть вводити назву клієнта"
        onInputChange={(_event, text, reason) => {
          if (reason === 'input') onCustomerSearch(text);
        }}
        onChange={(_event, customer) => set({ customer })}
        renderInput={(params) => (
          <TextField {...params} label="Клієнт" helperText="Необов'язково, з «Контрагентів»" />
        )}
      />
      <TaskStepsEditor
        steps={values.steps}
        error={error('steps')}
        disabled={disabled}
        onChange={(steps) => set({ steps })}
      />
    </Stack>
  );
}
