import { aiPromptMaxLength } from '@admin/ai/model';
import { Button, Stack, TextField } from '@mui/material';

interface Props {
  value: string;
  dirty: boolean;
  disabled: boolean;
  onChange: (text: string) => void;
  onSave: () => void;
}

/** Extra rules in plain words; the fixed instruction keeps the answer format. */
export function AiPromptSection({ value, dirty, disabled, onChange, onSave }: Props) {
  const tooLong = value.trim().length > aiPromptMaxLength;
  return (
    <Stack sx={{ gap: 1, alignItems: 'flex-start' }}>
      <TextField
        label="Додаткові правила"
        placeholder="Необов'язково. Наприклад: «Якщо постачальник ФОП Бистров, документ завжди без ПДВ»."
        multiline
        minRows={3}
        fullWidth
        value={value}
        error={tooLong}
        helperText={
          tooLong
            ? `Не більше ${aiPromptMaxLength} символів`
            : 'Основна інструкція вже вбудована. Пишіть сюди лише правила для помилок, що повторюються.'
        }
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
      <Button
        variant={dirty ? 'contained' : 'outlined'}
        disabled={disabled || !dirty || tooLong}
        onClick={onSave}
      >
        Зберегти умови
      </Button>
    </Stack>
  );
}
