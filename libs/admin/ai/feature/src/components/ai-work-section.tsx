import { Button, FormControlLabel, Stack, Switch, TextField } from '@mui/material';

interface Props {
  enabled: boolean;
  hasKey: boolean;
  limit: string;
  limitError?: string;
  limitDirty: boolean;
  disabled: boolean;
  onToggle: (enabled: boolean) => void;
  onLimitChange: (value: string) => void;
  onSaveLimit: () => void;
}

/** The switch saves at once; the limit has its own button next to it. */
export function AiWorkSection({
  enabled,
  hasKey,
  limit,
  limitError,
  limitDirty,
  disabled,
  onToggle,
  onLimitChange,
  onSaveLimit,
}: Props) {
  return (
    <Stack sx={{ gap: 2 }}>
      <FormControlLabel
        control={
          <Switch
            checked={enabled}
            disabled={disabled || (!hasKey && !enabled)}
            onChange={(event) => onToggle(event.target.checked)}
          />
        }
        label={hasKey ? 'ШІ увімкнено' : 'ШІ увімкнено (спочатку додайте ключ)'}
      />
      <Stack
        component="form"
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ gap: 1, alignItems: { sm: 'flex-start' } }}
        onSubmit={(event) => {
          event.preventDefault();
          onSaveLimit();
        }}
      >
        <TextField
          label="Ліміт на місяць, $"
          size="small"
          inputMode="decimal"
          value={limit}
          error={Boolean(limitError)}
          helperText={
            limitError ?? 'Коли витрати місяця дійдуть до ліміту, ШІ зупиниться до 1-го числа.'
          }
          disabled={disabled}
          onChange={(event) => onLimitChange(event.target.value)}
          sx={{ maxWidth: 320, flex: 1 }}
        />
        <Button
          type="submit"
          variant={limitDirty ? 'contained' : 'outlined'}
          disabled={disabled || !limitDirty}
        >
          Зберегти ліміт
        </Button>
      </Stack>
    </Stack>
  );
}
