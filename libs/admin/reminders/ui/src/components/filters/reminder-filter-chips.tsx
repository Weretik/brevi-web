import { Chip, Stack } from '@mui/material';

export interface ReminderFilterOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface Props<T extends string> {
  label: string;
  options: readonly ReminderFilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

/** 28 px filter chips; the selected chip uses the inverse surface. */
export function ReminderFilterChips<T extends string>({
  label,
  options,
  value,
  onChange,
}: Props<T>) {
  return (
    <Stack direction="row" role="group" aria-label={label} sx={{ flexWrap: 'wrap', gap: 1 }}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Chip
            key={option.value}
            label={option.count === undefined ? option.label : `${option.label} ${option.count}`}
            size="small"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            sx={{
              height: 28,
              borderRadius: 1.5,
              ...(selected && {
                bgcolor: 'secondary.main',
                color: 'secondary.contrastText',
                '&:hover': { bgcolor: 'secondary.main' },
              }),
            }}
            variant={selected ? 'filled' : 'outlined'}
          />
        );
      })}
    </Stack>
  );
}
