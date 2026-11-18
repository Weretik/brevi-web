import { taskLimits } from '@admin/tasks/model';
import { Autocomplete, MenuItem, Stack, TextField } from '@mui/material';

import { TaskScheduleFields } from './task-schedule-fields';
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
      <TaskScheduleFields values={values} error={error} disabled={disabled} onChange={set} />
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
