import { newStepKey, taskLimits } from '@admin/tasks/model';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import {
  Button,
  Checkbox,
  FormHelperText,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import type { TaskStepDraft } from '@admin/tasks/model';

interface Props {
  steps: readonly TaskStepDraft[];
  error?: string;
  disabled: boolean;
  onChange: (steps: readonly TaskStepDraft[]) => void;
}

/** «Кроки»: an ordered checklist the manager ticks later. */
export function TaskStepsEditor({ steps, error, disabled, onChange }: Props) {
  const update = (key: string, patch: Partial<TaskStepDraft>) =>
    onChange(steps.map((step) => (step.key === key ? { ...step, ...patch } : step)));

  return (
    <Stack sx={{ gap: 1 }}>
      <Typography variant="subtitle2" component="p" color="text.secondary">
        Кроки
      </Typography>
      {steps.map((step, index) => (
        <Stack key={step.key} direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
          <Checkbox
            checked={step.isDone}
            disabled={disabled}
            onChange={(event) => update(step.key, { isDone: event.target.checked })}
            slotProps={{ input: { 'aria-label': `Крок ${index + 1} виконано` } }}
          />
          <TextField
            size="small"
            fullWidth
            value={step.text}
            disabled={disabled}
            placeholder={`Крок ${index + 1}`}
            slotProps={{
              htmlInput: { maxLength: taskLimits.step, 'aria-label': `Крок ${index + 1}` },
            }}
            onChange={(event) => update(step.key, { text: event.target.value })}
          />
          <IconButton
            aria-label={`Видалити крок ${index + 1}`}
            disabled={disabled}
            onClick={() => onChange(steps.filter((x) => x.key !== step.key))}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Stack>
      ))}
      {error && <FormHelperText error>{error}</FormHelperText>}
      <Button
        startIcon={<AddOutlinedIcon />}
        disabled={disabled || steps.length >= taskLimits.steps}
        onClick={() => onChange([...steps, { key: newStepKey(), text: '', isDone: false }])}
        sx={{ alignSelf: 'flex-start' }}
      >
        Додати крок
      </Button>
    </Stack>
  );
}
