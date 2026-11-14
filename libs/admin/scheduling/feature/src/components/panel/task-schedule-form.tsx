import {
  Alert,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

import { ScheduleKindFields } from './schedule-kind-fields';

import type { ScheduleFormErrors, ScheduleFormValues, ScheduleKind } from '@admin/scheduling/model';

interface Props {
  values: ScheduleFormValues;
  errors: ScheduleFormErrors;
  serverError: string | null;
  onChange: (changes: Partial<ScheduleFormValues>) => void;
}

const kinds: { value: ScheduleKind; label: string }[] = [
  { value: 'daily', label: 'За днями й часом' },
  { value: 'interval', label: 'Через інтервал' },
  { value: 'manual', label: 'Лише вручну' },
];

/** R-04: on/off, the kind with its fields, and an optional one-time next run. */
export function TaskScheduleForm({ values, errors, serverError, onChange }: Props) {
  return (
    <Stack sx={{ gap: 3 }}>
      <FormControlLabel
        control={
          <Switch
            checked={values.enabled}
            onChange={(event) => onChange({ enabled: event.target.checked })}
          />
        }
        label="Увімкнено"
      />
      <Stack sx={{ gap: 1 }}>
        <Typography variant="subtitle2" id="schedule-kind-label">
          Як запускати
        </Typography>
        <RadioGroup
          aria-labelledby="schedule-kind-label"
          value={values.kind}
          onChange={(event) => onChange({ kind: event.target.value as ScheduleKind })}
        >
          {kinds.map((kind) => (
            <FormControlLabel
              key={kind.value}
              value={kind.value}
              control={<Radio />}
              label={kind.label}
            />
          ))}
        </RadioGroup>
      </Stack>
      <ScheduleKindFields values={values} errors={errors} onChange={onChange} />
      <TextField
        type="datetime-local"
        size="small"
        label="Наступний запуск (Київ)"
        value={values.nextRunAt}
        onChange={(event) => onChange({ nextRunAt: event.target.value })}
        error={Boolean(errors.nextRunAt)}
        helperText={
          errors.nextRunAt ??
          'Необовʼязково: перенести один найближчий запуск. Далі — за розкладом.'
        }
        slotProps={{ inputLabel: { shrink: true } }}
      />
      {serverError && <Alert severity="error">{serverError}</Alert>}
    </Stack>
  );
}
