import { Button, Stack } from '@mui/material';

import { QuoteSettingsField } from '../form/quote-settings-field';

import type { QuoteEmailTemplateDraft } from '@admin/quotes/model';

interface Props {
  /** Error and preview path of the letter: `email` or `letter:<key>`. */
  path: string;
  /** A letter variant has a name the manager picks it by; the main letter has none. */
  name?: { value: string; saved: string | undefined; error: string | undefined };
  letter: QuoteEmailTemplateDraft;
  saved: QuoteEmailTemplateDraft | undefined;
  errorOf: (field: string) => string | undefined;
  onNameChange?: (name: string) => void;
  onChange: (patch: Partial<QuoteEmailTemplateDraft>) => void;
  onRemove?: () => void;
}

/** The fields of one letter template, opened inside its row. */
export function QuoteLetterEditor({
  path,
  name,
  letter,
  saved,
  errorOf,
  onNameChange,
  onChange,
  onRemove,
}: Props) {
  return (
    <Stack sx={{ gap: 1.5, px: 2, pb: 2 }}>
      {name && onNameChange && (
        <QuoteSettingsField
          required
          path={`${path}.name`}
          label="Назва (бачать лише менеджери)"
          value={name.value}
          saved={name.saved}
          error={name.error}
          onChange={onNameChange}
        />
      )}
      <QuoteSettingsField
        required
        marks
        path={`${path}.subject`}
        label="Тема листа"
        value={letter.subject}
        saved={saved?.subject}
        error={errorOf('subject')}
        onChange={(subject) => onChange({ subject })}
      />
      <QuoteSettingsField
        required
        multiline
        marks
        path={`${path}.body`}
        label="Текст листа"
        value={letter.body}
        saved={saved?.body}
        error={errorOf('body')}
        onChange={(body) => onChange({ body })}
      />
      {onRemove && (
        <Button color="error" onClick={onRemove} sx={{ alignSelf: 'flex-start' }}>
          Видалити шаблон
        </Button>
      )}
    </Stack>
  );
}
