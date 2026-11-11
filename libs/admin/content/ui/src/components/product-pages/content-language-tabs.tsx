import { contentLanguageLabel, contentLanguages } from '@admin/content/model';
import { Tab, Tabs } from '@mui/material';

import type { ContentLanguage } from '@admin/content/model';

interface Props {
  value: ContentLanguage;
  /** Languages whose fields have an error; their tab is marked. */
  invalid?: readonly ContentLanguage[];
  onChange: (language: ContentLanguage) => void;
}

/** «Українська / Російська» switch above the texts of a product page. */
export function ContentLanguageTabs({ value, invalid = [], onChange }: Props) {
  return (
    <Tabs
      value={value}
      onChange={(_, next: ContentLanguage) => onChange(next)}
      aria-label="Мова текстів"
      sx={{ borderBottom: 1, borderColor: 'divider', minHeight: 40 }}
    >
      {contentLanguages.map((language) => (
        <Tab
          key={language}
          value={language}
          label={
            invalid.includes(language)
              ? `${contentLanguageLabel(language)} · є помилки`
              : contentLanguageLabel(language)
          }
          sx={{ minHeight: 40, color: invalid.includes(language) ? 'error.main' : undefined }}
        />
      ))}
    </Tabs>
  );
}
