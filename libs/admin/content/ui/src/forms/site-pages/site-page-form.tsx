import { sitePageLimits } from '@admin/content/model';
import { ReferenceFormSection } from '@admin/references/ui';
import { RichTextEditor } from '@admin/shared/ui';
import { Alert, Button, Stack, TextField } from '@mui/material';
import { useState } from 'react';

import { SitePageFaqFields } from './site-page-faq-fields';
import { ContentLanguageTabs } from '../../components/product-pages/content-language-tabs';

import type {
  ContentLanguage,
  SitePageErrors,
  SitePageFormValues,
  SitePageTextValues,
} from '@admin/content/model';

interface Props {
  values: SitePageFormValues;
  errors: SitePageErrors;
  disabled: boolean;
  /** The home title is shown as written; others get « — Brevi». */
  titleHasBrand: boolean;
  onChange: (values: SitePageFormValues) => void;
}

const count = (value: string, good: number) => {
  const length = value.trim().length;
  return `${length} символів${length > good ? `, у пошуку видно близько ${good}` : ''}.`;
};

/**
 * Texts of one page by language: search title and description, the main text in the visual editor and the
 * frequent questions. An empty field gives the page back the site's own text.
 */
export function SitePageForm({ values, errors, disabled, titleHasBrand, onChange }: Props) {
  const [language, setLanguage] = useState<ContentLanguage>('uk');
  const text = values[language];
  const error = (field: 'title' | 'description' | 'text' | 'faq') => errors[`${language}.${field}`];
  const invalid = (['uk', 'ru'] as const).filter((item) =>
    Object.keys(errors).some((key) => key.startsWith(`${item}.`)),
  );
  const set = (patch: Partial<SitePageTextValues>) =>
    onChange({ ...values, [language]: { ...text, ...patch } });
  const prefix = `site-page-${language}`;

  return (
    <>
      <ContentLanguageTabs value={language} invalid={invalid} onChange={setLanguage} />
      <ReferenceFormSection title="У пошуку Google">
        <TextField
          key={`${prefix}-title`}
          label="Заголовок у пошуку"
          value={text.title}
          disabled={disabled}
          error={Boolean(error('title'))}
          helperText={
            error('title') ??
            `${titleHasBrand ? 'Показується як написано.' : 'Сайт додає « — Brevi».'} ${count(text.title, sitePageLimits.goodTitle)}`
          }
          slotProps={{ htmlInput: { maxLength: sitePageLimits.title } }}
          onChange={(event) => set({ title: event.target.value })}
          fullWidth
        />
        <TextField
          key={`${prefix}-description`}
          label="Опис у пошуку"
          value={text.description}
          disabled={disabled}
          multiline
          minRows={2}
          error={Boolean(error('description'))}
          helperText={
            error('description') ??
            `Текст під заголовком у Google. ${count(text.description, sitePageLimits.goodDescription)}`
          }
          slotProps={{ htmlInput: { maxLength: sitePageLimits.description } }}
          onChange={(event) => set({ description: event.target.value })}
          fullWidth
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Текст сторінки">
        <RichTextEditor
          key={`${prefix}-text`}
          label="Основний текст"
          initialValue={text.text}
          disabled={disabled}
          error={Boolean(error('text'))}
          helperText={
            error('text') ??
            'Показується внизу сторінки. Для пошуку добре 300–600 слів. Виділіть текст і натисніть кнопку: заголовок, жирний, курсив або список. Порожнє поле лишає текст сайту.'
          }
          onChange={(next) => set({ text: next })}
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Часті запитання">
        {error('faq') && <Alert severity="error">{error('faq')}</Alert>}
        <SitePageFaqFields
          key={`${prefix}-faq`}
          items={text.faq}
          disabled={disabled}
          onChange={(faq) => set({ faq })}
        />
        <Stack direction="row">
          <Button
            variant="outlined"
            disabled={disabled || text.faq.length >= sitePageLimits.questions}
            onClick={() => set({ faq: [...text.faq, { question: '', answer: '' }] })}
          >
            Додати запитання
          </Button>
        </Stack>
      </ReferenceFormSection>
    </>
  );
}
