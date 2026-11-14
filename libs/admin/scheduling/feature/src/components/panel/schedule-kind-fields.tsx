import { weekdayLabels } from '@admin/scheduling/model';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { Button, Chip, IconButton, Stack, TextField, Typography } from '@mui/material';

import type { ScheduleFormErrors, ScheduleFormValues } from '@admin/scheduling/model';

interface Props {
  values: ScheduleFormValues;
  errors: ScheduleFormErrors;
  onChange: (changes: Partial<ScheduleFormValues>) => void;
}

function DailyFields({ values, errors, onChange }: Props) {
  const setTime = (index: number, time: string) =>
    onChange({ times: values.times.map((current, at) => (at === index ? time : current)) });
  const toggleDay = (day: number) =>
    onChange({
      days: values.days.includes(day)
        ? values.days.filter((d) => d !== day)
        : [...values.days, day],
    });
  return (
    <Stack sx={{ gap: 2 }}>
      <Stack sx={{ gap: 1 }}>
        <Typography variant="subtitle2">Час запуску (Київ)</Typography>
        {values.times.map((time, index) => (
          <Stack key={index} direction="row" sx={{ gap: 1, alignItems: 'center' }}>
            <TextField
              type="time"
              size="small"
              label={`Час ${index + 1}`}
              value={time}
              onChange={(event) => setTime(index, event.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            {values.times.length > 1 && (
              <IconButton
                aria-label={`Прибрати час ${index + 1}`}
                onClick={() => onChange({ times: values.times.filter((_, at) => at !== index) })}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
        ))}
        {values.times.length < 6 && (
          <Button
            startIcon={<AddOutlinedIcon />}
            sx={{ alignSelf: 'flex-start' }}
            onClick={() => onChange({ times: [...values.times, '12:00'] })}
          >
            Додати час
          </Button>
        )}
        {errors.times && (
          <Typography color="error.main" variant="caption">
            {errors.times}
          </Typography>
        )}
      </Stack>
      <Stack sx={{ gap: 1 }}>
        <Typography variant="subtitle2">Дні тижня</Typography>
        <Stack
          direction="row"
          role="group"
          aria-label="Дні тижня"
          sx={{ gap: 0.75, flexWrap: 'wrap' }}
        >
          {weekdayLabels.map((label, index) => {
            const selected = values.days.includes(index + 1);
            return (
              <Chip
                key={label}
                label={label}
                aria-pressed={selected}
                color={selected ? 'secondary' : 'default'}
                variant={selected ? 'filled' : 'outlined'}
                onClick={() => toggleDay(index + 1)}
              />
            );
          })}
        </Stack>
        {errors.days && (
          <Typography color="error.main" variant="caption">
            {errors.days}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}

function IntervalFields({ values, errors, onChange }: Props) {
  return (
    <Stack sx={{ gap: 2 }}>
      <TextField
        label="Кожні, хвилин"
        size="small"
        inputMode="numeric"
        value={values.everyMinutes}
        onChange={(event) => onChange({ everyMinutes: event.target.value })}
        error={Boolean(errors.everyMinutes)}
        helperText={errors.everyMinutes ?? 'Від 5 до 1440.'}
      />
      <Stack direction="row" sx={{ gap: 1 }}>
        <TextField
          label="З години"
          size="small"
          inputMode="numeric"
          value={values.fromHour}
          onChange={(event) => onChange({ fromHour: event.target.value })}
          error={Boolean(errors.hours)}
        />
        <TextField
          label="До години"
          size="small"
          inputMode="numeric"
          value={values.toHour}
          onChange={(event) => onChange({ toHour: event.target.value })}
          error={Boolean(errors.hours)}
        />
      </Stack>
      <Typography variant="caption" color={errors.hours ? 'error.main' : 'text.secondary'}>
        {errors.hours ?? 'Необовʼязково: години, у які задача працює. Порожньо — цілодобово.'}
      </Typography>
    </Stack>
  );
}

/** Fields of the chosen kind: Kyiv times and weekdays, or an interval with optional hours. */
export function ScheduleKindFields(props: Props) {
  if (props.values.kind === 'daily') return <DailyFields {...props} />;
  if (props.values.kind === 'interval') return <IntervalFields {...props} />;
  return (
    <Typography variant="body2" color="text.secondary">
      Задача не запускається за розкладом, лише кнопкою «Запустити зараз».
    </Typography>
  );
}
