import { Button, Stack, TextField } from '@mui/material';

interface Props {
  label: string;
  value: string;
  error?: string;
  disabled: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

/** The field of a new or changed condition with «Зберегти» and «Скасувати». */
export function AiRuleEditor({
  label,
  value,
  error,
  disabled,
  onChange,
  onSubmit,
  onCancel,
}: Props) {
  return (
    <Stack
      component="form"
      sx={{ gap: 1, flex: 1, minWidth: 0 }}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <TextField
        autoFocus
        size="small"
        label={label}
        placeholder="Наприклад: «Номер рахунку пиши без №»"
        value={value}
        error={Boolean(error)}
        helperText={error}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
      <Stack direction="row" sx={{ gap: 1 }}>
        <Button type="submit" variant="contained" size="small" disabled={disabled}>
          Зберегти
        </Button>
        <Button size="small" disabled={disabled} onClick={onCancel}>
          Скасувати
        </Button>
      </Stack>
    </Stack>
  );
}
