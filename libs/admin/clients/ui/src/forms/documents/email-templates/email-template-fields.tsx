import { Alert, Button, Stack, TextField } from '@mui/material';

import type { EmailTemplateDraft, EmailTemplateDraftErrors } from '@admin/clients/model';

export function EmailTemplateFields({
  value,
  errors,
  disabled,
  onChange,
  onSave,
}: {
  value: EmailTemplateDraft;
  errors: EmailTemplateDraftErrors;
  disabled: boolean;
  onChange: (value: EmailTemplateDraft) => void;
  onSave: () => void;
}) {
  return (
    <Stack
      component="form"
      aria-label="Нова версія шаблону листа"
      spacing={2}
      onSubmit={(event) => {
        event.preventDefault();
        if (!disabled) onSave();
      }}
    >
      <Alert severity="info">
        Дозволені підстановки: {'{recipientName}'}, {'{managerName}'}, {'{quoteNumber}'}. Текст
        звичайний, без HTML-форматування.
      </Alert>
      {(
        [
          ['name', 'Назва шаблону', 120],
          ['subject', 'Тема листа', 200],
          ['body', 'Текст листа', 3000],
        ] as const
      ).map(([key, label, maximum]) => (
        <TextField
          key={key}
          label={label}
          required
          value={value[key]}
          disabled={disabled}
          multiline={key === 'body'}
          minRows={key === 'body' ? 5 : undefined}
          error={!!errors[key]}
          helperText={errors[key] ?? `До ${maximum} символів.`}
          slotProps={{ htmlInput: { maxLength: maximum } }}
          onChange={(event) => onChange({ ...value, [key]: event.target.value })}
        />
      ))}
      <Button type="submit" variant="contained" disabled={disabled}>
        Створити нову версію
      </Button>
    </Stack>
  );
}
