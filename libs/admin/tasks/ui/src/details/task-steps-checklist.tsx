import { Box, Checkbox, Stack, Typography } from '@mui/material';

import type { TaskDetail } from '@admin/tasks/model';

/** Numbers in a fixed-width font. */
export const taskMono = {
  fontFamily: 'var(--admin-font-mono)',
  fontVariantNumeric: 'tabular-nums',
};
const mono = taskMono;

interface Props {
  task: TaskDetail;
  disabled: boolean;
  onStep: (stepId: number, isDone: boolean) => void;
}

/** «Кроки»: tick a step done or back. */
export function TaskStepsChecklist({ task, disabled, onStep }: Props) {
  return (
    <Box>
      <Typography variant="subtitle2" component="h3" color="text.secondary" sx={{ mb: 0.5 }}>
        Кроки{' '}
        <Box component="span" sx={mono}>
          {task.stepsDone}/{task.stepsTotal}
        </Box>
      </Typography>
      {task.steps.map((step) => (
        <Stack key={step.id} direction="row" sx={{ alignItems: 'center' }}>
          <Checkbox
            checked={step.isDone}
            disabled={disabled}
            onChange={(event) => onStep(step.id, event.target.checked)}
            slotProps={{ input: { 'aria-label': step.text } }}
          />
          <Typography
            variant="body2"
            sx={{
              textDecoration: step.isDone ? 'line-through' : 'none',
              color: step.isDone ? 'text.secondary' : 'text.primary',
            }}
          >
            {step.text}
          </Typography>
        </Stack>
      ))}
    </Box>
  );
}
