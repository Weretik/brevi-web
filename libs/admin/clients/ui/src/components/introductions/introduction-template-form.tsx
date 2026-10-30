import { Alert, Button, MenuItem, Stack, TextField } from '@mui/material';
import { IntroductionFormatSelector } from './introduction-format-selector';
import type {
  IntroductionEmailTemplateOption,
  IntroductionTemplateFormValue,
} from '@admin/clients/model';

export function IntroductionTemplateForm({
  value,
  emailTemplateOptions = [],
  disabled,
  submitLabel,
  onChange,
  onSave,
}: {
  value: IntroductionTemplateFormValue;
  emailTemplateOptions?: readonly IntroductionEmailTemplateOption[];
  disabled: boolean;
  submitLabel: string;
  onChange: (value: IntroductionTemplateFormValue) => void;
  onSave: () => void;
}) {
  const hasStoredVersion =
    !!value.emailTemplateVersionId &&
    !emailTemplateOptions.some((option) => option.id === value.emailTemplateVersionId);
  const nameTooLong = value.name.trim().length > 300;
  const incomplete = !value.name.trim() || nameTooLong || !value.emailTemplateVersionId;
  return (
    <Stack
      component="form"
      spacing={2}
      aria-label="Збереження сезонної добірки"
      onSubmit={(event) => {
        event.preventDefault();
        if (!disabled && !incomplete) onSave();
      }}
    >
      <TextField
        label="Назва добірки"
        required
        value={value.name}
        error={nameTooLong}
        helperText={nameTooLong ? 'Назва має містити не більше 300 символів.' : undefined}
        disabled={disabled}
        slotProps={{ htmlInput: { maxLength: 300 } }}
        onChange={(event) => onChange({ ...value, name: event.target.value })}
      />
      <IntroductionFormatSelector
        value={value.format}
        disabled={disabled}
        onChange={(format) => onChange({ ...value, format })}
      />
      <TextField
        select
        label="Шаблон листа"
        required
        value={value.emailTemplateVersionId}
        disabled={disabled}
        helperText="Шаблон зберігається разом із добіркою. Надсилання виконується окремою дією."
        onChange={(event) => onChange({ ...value, emailTemplateVersionId: event.target.value })}
      >
        <MenuItem value="" disabled>
          Оберіть шаблон
        </MenuItem>
        {hasStoredVersion && (
          <MenuItem value={value.emailTemplateVersionId}>Збережена версія шаблону</MenuItem>
        )}
        {emailTemplateOptions.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      {!value.emailTemplateVersionId && emailTemplateOptions.length === 0 && (
        <Alert severity="warning">
          Немає доступної версії шаблону листа. Перевірте налаштування перед збереженням добірки.
        </Alert>
      )}
      <Button type="submit" variant="contained" disabled={disabled || incomplete}>
        {submitLabel}
      </Button>
    </Stack>
  );
}
