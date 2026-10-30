import { Alert, Button, Stack } from '@mui/material';
import { useRef, useState } from 'react';

export function CustomFileUpload({
  disabled,
  onUpload,
}: {
  disabled: boolean;
  onUpload: (file: File) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  return (
    <Stack spacing={1}>
      <input
        ref={input}
        type="file"
        aria-label="Приватний файл PDF, JPEG або PNG"
        accept="application/pdf,image/jpeg,image/png"
        disabled={disabled}
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = '';
          if (!file || disabled) return;
          if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
            setError('Оберіть файл PDF, JPEG або PNG.');
          } else if (file.size < 1 || file.size > 20971520) {
            setError('Розмір файлу має бути від 1 байта до 20 МіБ.');
          } else {
            setError('');
            onUpload(file);
          }
        }}
      />
      <Button disabled={disabled} onClick={() => input.current?.click()}>
        Додати приватний файл
      </Button>
      {error && <Alert severity="error">{error}</Alert>}
    </Stack>
  );
}
