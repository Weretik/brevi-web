import { Button, Checkbox, FormControlLabel, Stack, Typography } from '@mui/material';

import type { CustomPrivateFile } from '@admin/clients/model';

export function CustomFileRow({
  file,
  disabled,
  readOnly,
  downloadDisabled,
  onChange,
  onRemove,
  onDownload,
}: {
  file: CustomPrivateFile;
  disabled: boolean;
  readOnly: boolean;
  downloadDisabled: boolean;
  onChange: (flags: { showInQuote: boolean; production: boolean }) => void;
  onRemove: () => void;
  onDownload: () => void;
}) {
  return (
    <Stack
      spacing={1}
      component="li"
      sx={{ listStyle: 'none', border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}
    >
      <Typography>
        {file.contentType} ·{' '}
        {(file.length / 1024).toLocaleString('uk-UA', { maximumFractionDigits: 1 })} КіБ · {file.id}
      </Typography>
      <Typography variant="body2">
        {file.isFinalized
          ? 'Метадані збережено. Наявність файлу перевіряється при завантаженні.'
          : 'Файл завантажено тимчасово. Збережіть прив’язку до конфігурації.'}
      </Typography>
      {!file.isFinalized && (
        <Typography variant="body2">
          Тимчасово до: {new Date(file.expiresAt).toLocaleString('uk-UA')}
        </Typography>
      )}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
        <FormControlLabel
          label="Показувати в КП"
          control={
            <Checkbox
              checked={file.showInQuote}
              disabled={disabled || readOnly}
              onChange={(_, checked) =>
                onChange({ showInQuote: checked, production: file.production })
              }
            />
          }
        />
        <FormControlLabel
          label="Для виробництва"
          control={
            <Checkbox
              checked={file.production}
              disabled={disabled || readOnly}
              onChange={(_, checked) =>
                onChange({ showInQuote: file.showInQuote, production: checked })
              }
            />
          }
        />
        <Button disabled={downloadDisabled || !file.isFinalized} onClick={onDownload}>
          Завантажити файл
        </Button>
        {!readOnly && (
          <Button disabled={disabled} onClick={onRemove}>
            Прибрати прив’язку
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
