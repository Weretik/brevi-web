import { contentLanguages, sitePageLimits } from '@admin/content/model';
import { Stack, TextField, Typography } from '@mui/material';

import type { SitePageErrors, SitePageFormValues } from '@admin/content/model';

interface Props {
  values: SitePageFormValues;
  errors: SitePageErrors;
  disabled: boolean;
  /** The home title is shown as written; others get « — Brevi». */
  titleHasBrand: boolean;
  onChange: (values: SitePageFormValues) => void;
}

const languageTitle = { uk: 'Українською', ru: 'Російською' } as const;

const count = (value: string, good: number) => {
  const length = value.trim().length;
  return `${length} символів${length > good ? `, у пошуку видно близько ${good}` : ''}.`;
};

/**
 * Search texts of one page in both languages. An empty field gives the page back the site's own text. Titles and
 * descriptions are plain lines, so no visual editor is needed.
 */
export function SitePageForm({ values, errors, disabled, titleHasBrand, onChange }: Props) {
  return (
    <Stack sx={{ gap: 3 }}>
      {contentLanguages.map((language) => {
        const text = values[language];
        const set = (patch: Partial<typeof text>) =>
          onChange({ ...values, [language]: { ...text, ...patch } });
        return (
          <Stack key={language} sx={{ gap: 2 }}>
            <Typography variant="subtitle2">{languageTitle[language]}</Typography>
            <TextField
              label="Заголовок у пошуку"
              value={text.title}
              disabled={disabled}
              error={Boolean(errors[`${language}.title`])}
              helperText={
                errors[`${language}.title`] ??
                `${titleHasBrand ? 'Показується як написано.' : 'Сайт додає « — Brevi».'} ${count(text.title, sitePageLimits.goodTitle)}`
              }
              slotProps={{ htmlInput: { maxLength: sitePageLimits.title } }}
              onChange={(event) => set({ title: event.target.value })}
            />
            <TextField
              label="Опис у пошуку"
              value={text.description}
              disabled={disabled}
              multiline
              minRows={2}
              error={Boolean(errors[`${language}.description`])}
              helperText={
                errors[`${language}.description`] ??
                `Текст під заголовком у Google. ${count(text.description, sitePageLimits.goodDescription)}`
              }
              slotProps={{ htmlInput: { maxLength: sitePageLimits.description } }}
              onChange={(event) => set({ description: event.target.value })}
            />
          </Stack>
        );
      })}
    </Stack>
  );
}
