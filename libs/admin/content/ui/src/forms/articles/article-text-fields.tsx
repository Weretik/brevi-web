import { articleLimits } from '@admin/content/model';
import { ReferenceFormSection } from '@admin/references/ui';
import { RichTextEditor } from '@admin/shared/ui';
import { TextField } from '@mui/material';
import { useState } from 'react';

import { ContentLanguageTabs } from '../../components/product-pages/content-language-tabs';

import type {
  ArticleErrors,
  ArticleFormValues,
  ArticleTextValues,
  ContentLanguage,
} from '@admin/content/model';
import type { RichTextImage } from '@admin/shared/ui';

const counter = (value: string, limit: number) => `${value.trim().length} з ${limit}`;

/** «Тексти» of an article by language: the name, the short description, SEO and the text in the visual editor. */
export function ArticleTextFields({
  values,
  errors,
  disabled,
  onChange,
  onPickPhotos,
}: {
  values: ArticleFormValues;
  errors: ArticleErrors;
  disabled: boolean;
  onChange: (values: ArticleFormValues) => void;
  onPickPhotos: (done: (photos: RichTextImage[]) => void) => void;
}) {
  const [language, setLanguage] = useState<ContentLanguage>('uk');
  const text = values[language];
  const textErrors = errors[language] ?? {};
  const invalid = (['uk', 'ru'] as const).filter((item) => errors[item]);
  const set = (changes: Partial<ArticleTextValues>) =>
    onChange({ ...values, [language]: { ...text, ...changes } });
  const prefix = `article-${language}`;
  return (
    <ReferenceFormSection title="Тексти">
      <ContentLanguageTabs value={language} invalid={invalid} onChange={setLanguage} />
      <TextField
        key={`${prefix}-title`}
        label="Назва"
        value={text.title}
        disabled={disabled}
        error={Boolean(textErrors.title)}
        helperText={
          textErrors.title ??
          (language === 'uk'
            ? 'Заголовок статті на сайті.'
            : 'Якщо порожньо, російська версія сайту покаже статтю українською.')
        }
        onChange={(event) => set({ title: event.target.value })}
        fullWidth
      />
      <TextField
        key={`${prefix}-excerpt`}
        label="Короткий опис"
        value={text.excerpt}
        disabled={disabled}
        error={Boolean(textErrors.excerpt)}
        helperText={
          textErrors.excerpt ??
          `Одне-два речення під назвою у списку статей. ${counter(text.excerpt, articleLimits.excerpt)}`
        }
        onChange={(event) => set({ excerpt: event.target.value })}
        multiline
        minRows={2}
        fullWidth
      />
      <TextField
        key={`${prefix}-seo-title`}
        label="SEO-заголовок"
        value={text.seoTitle}
        disabled={disabled}
        error={Boolean(textErrors.seoTitle)}
        helperText={
          textErrors.seoTitle ??
          `Заголовок у пошуку Google. ${counter(text.seoTitle, articleLimits.seoTitle)}`
        }
        onChange={(event) => set({ seoTitle: event.target.value })}
        fullWidth
      />
      <TextField
        key={`${prefix}-seo-description`}
        label="SEO-опис"
        value={text.seoDescription}
        disabled={disabled}
        error={Boolean(textErrors.seoDescription)}
        helperText={
          textErrors.seoDescription ??
          `Два речення під заголовком у пошуку. ${counter(text.seoDescription, articleLimits.seoDescription)}`
        }
        onChange={(event) => set({ seoDescription: event.target.value })}
        multiline
        minRows={2}
        fullWidth
      />
      <RichTextEditor
        key={`${prefix}-body`}
        label="Текст статті"
        initialValue={text.body}
        disabled={disabled}
        error={Boolean(textErrors.body)}
        helperText={
          textErrors.body ??
          'Виділіть текст і натисніть кнопку: заголовок, жирний, курсив або список. Кнопка «Фото» ставить фото з бібліотеки туди, де стоїть курсор.'
        }
        onChange={(next) => set({ body: next })}
        onPickImages={onPickPhotos}
      />
    </ReferenceFormSection>
  );
}
