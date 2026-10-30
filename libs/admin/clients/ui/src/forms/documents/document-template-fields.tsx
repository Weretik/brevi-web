import { Stack, TextField } from '@mui/material';

import type { DocumentTemplateDraft } from '@admin/clients/model';

type Errors = Partial<Record<keyof DocumentTemplateDraft, string>>;

export function DocumentTemplateFields({
  value,
  errors,
  disabled,
  onChange,
}: {
  value: DocumentTemplateDraft;
  errors: Errors;
  disabled: boolean;
  onChange: (value: DocumentTemplateDraft) => void;
}) {
  const fields = [
    ['title', 'Заголовок КП', 200, false],
    ['vatNotice', 'Податкове формулювання', 300, false],
    ['openingText', 'Вступний текст', 3000, true],
    ['ctaTitle', 'Заголовок заклику до дії', 500, false],
    ['ctaText', 'Текст заклику до дії', 3000, true],
    ['ctaContactTemplate', 'Контактний текст', 2000, true],
  ] as const;
  return (
    <Stack spacing={2}>
      {fields.map(([field, label, maxLength, multiline]) => (
        <TextField
          key={field}
          label={label}
          required
          multiline={multiline}
          minRows={multiline ? 2 : undefined}
          value={value[field]}
          disabled={disabled}
          error={!!errors[field]}
          helperText={errors[field]}
          slotProps={{ htmlInput: { maxLength } }}
          onChange={(event) => onChange({ ...value, [field]: event.target.value })}
        />
      ))}
    </Stack>
  );
}
