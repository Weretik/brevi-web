import { Alert, Button, Stack, Typography } from '@mui/material';

interface MediaUploadProps {
  uploading: boolean;
  fileName: string | null;
  error: string | null;
  onUpload: (file: File) => void;
}

export function MediaUpload({ uploading, fileName, error, onUpload }: MediaUploadProps) {
  return (
    <Stack sx={{ gap: 1, alignItems: { xs: 'stretch', sm: 'flex-end' } }}>
      <Button component="label" variant="contained" disabled={uploading}>
        {uploading ? 'Завантаження…' : 'Завантажити фото'}
        <input
          hidden
          aria-label="Оберіть фото"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void onUpload(file);
            event.target.value = '';
          }}
        />
      </Button>
      {fileName && <Typography variant="body2">Обрано: {fileName}</Typography>}
      {error && <Alert severity="error">{error}</Alert>}
    </Stack>
  );
}
