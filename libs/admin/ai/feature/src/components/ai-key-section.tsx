import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import { Box, Button, Link, Stack, TextField, Typography } from '@mui/material';

interface Props {
  hasKey: boolean;
  keyHint: string | null;
  value: string;
  error?: string;
  disabled: boolean;
  onChange: (value: string) => void;
  onSave: () => void;
  onRemove: () => void;
}

/** The key is write-only: only its last four characters are shown after saving. */
export function AiKeySection({
  hasKey,
  keyHint,
  value,
  error,
  disabled,
  onChange,
  onSave,
  onRemove,
}: Props) {
  return (
    <Stack sx={{ gap: 1.5 }}>
      {hasKey ? (
        <Typography variant="body2">
          Ключ додано:{' '}
          <Box component="span" sx={{ fontFamily: 'var(--admin-font-mono)' }}>
            sk-…{keyHint}
          </Box>
          . Він зберігається зашифрованим і більше не показується.
        </Typography>
      ) : (
        <Typography variant="body2">
          Створіть ключ на{' '}
          <Link href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer">
            platform.openai.com → API keys
          </Link>{' '}
          і вставте його нижче.
        </Typography>
      )}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ gap: 1, alignItems: { sm: 'flex-start' } }}
      >
        <TextField
          label={hasKey ? 'Новий ключ' : 'Ключ OpenAI'}
          type="password"
          autoComplete="off"
          size="small"
          value={value}
          error={Boolean(error)}
          helperText={error ?? 'Починається з sk-. Не надсилайте ключ у чат.'}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          sx={{ flex: 1 }}
        />
        <Button
          variant="outlined"
          startIcon={<KeyOutlinedIcon />}
          disabled={disabled}
          onClick={onSave}
        >
          {hasKey ? 'Замінити ключ' : 'Зберегти ключ'}
        </Button>
        {hasKey && (
          <Button color="error" disabled={disabled} onClick={onRemove}>
            Видалити ключ
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
