import { aiPromptMaxLength } from '@admin/ai/model';
import { Button, Stack, TextField } from '@mui/material';

import type { AiPrompt } from '@admin/ai/model';

interface Props {
  prompt: AiPrompt;
  value: string;
  dirty: boolean;
  disabled: boolean;
  onChange: (text: string) => void;
  onSave: () => void;
}

/** Extra rules in plain words; the fixed instruction keeps the answer format. */
export function AiPromptSection({ prompt, value, dirty, disabled, onChange, onSave }: Props) {
  const tooLong = value.trim().length > aiPromptMaxLength;
  return (
    <Stack sx={{ gap: 1, alignItems: 'flex-start' }}>
      <TextField
        label={prompt.title}
        multiline
        minRows={3}
        fullWidth
        value={value}
        error={tooLong}
        helperText={
          tooLong
            ? `Не більше ${aiPromptMaxLength} символів`
            : 'Наприклад: «Номер замовлення бери після слова Замовлення №». Додається до основної інструкції.'
        }
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
      <Button variant="outlined" disabled={disabled || !dirty || tooLong} onClick={onSave}>
        Зберегти умови
      </Button>
    </Stack>
  );
}
