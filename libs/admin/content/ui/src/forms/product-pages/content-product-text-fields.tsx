import { contentProductLimits } from '@admin/content/model';
import { ReferenceFormSection } from '@admin/references/ui';
import { RichTextEditor } from '@admin/shared/ui';
import { TextField } from '@mui/material';
import { useState } from 'react';

import { ContentFactsEditor } from './content-facts-editor';
import { ContentSpecsEditor } from './content-specs-editor';
import { ContentLanguageTabs } from '../../components/product-pages/content-language-tabs';

import type {
  ContentLanguage,
  ContentProductErrors,
  ContentProductFormValues,
  ContentProductTextValues,
} from '@admin/content/model';

const counter = (value: string, limit: number) => `${value.trim().length} з ${limit}`;

/** «Тексти» of a product page by language: name, SEO, short facts, the description and characteristics. */
export function ContentProductTextFields({
  values,
  errors,
  disabled,
  onChange,
}: {
  values: ContentProductFormValues;
  errors: ContentProductErrors;
  disabled: boolean;
  onChange: (values: ContentProductFormValues) => void;
}) {
  const [language, setLanguage] = useState<ContentLanguage>('uk');
  const text = values[language];
  const textErrors = errors[language] ?? {};
  const invalid = (['uk', 'ru'] as const).filter((item) => errors[item]);
  const set = (changes: Partial<ContentProductTextValues>) =>
    onChange({ ...values, [language]: { ...text, ...changes } });
  const prefix = `content-product-${language}`;
  return (
    <ReferenceFormSection title="Тексти">
      <ContentLanguageTabs value={language} invalid={invalid} onChange={setLanguage} />
      <TextField
        key={`${prefix}-name`}
        label="Назва на сайті"
        value={text.name}
        disabled={disabled}
        error={Boolean(textErrors.name)}
        helperText={textErrors.name ?? 'Якщо порожньо, сайт покаже назву з «Товари».'}
        onChange={(event) => set({ name: event.target.value })}
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
          `Заголовок у пошуку Google. ${counter(text.seoTitle, contentProductLimits.seoTitle)}`
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
          `Два речення під заголовком у пошуку. ${counter(text.seoDescription, contentProductLimits.seoDescription)}`
        }
        onChange={(event) => set({ seoDescription: event.target.value })}
        multiline
        minRows={2}
        fullWidth
      />
      <ContentFactsEditor
        key={`${prefix}-summary`}
        label="Короткі відомості"
        rows={text.summary}
        disabled={disabled}
        error={textErrors.summary}
        helperText="Показуються біля фото: наприклад «Сезон» і «весна, літо, осінь». Назву можна не заповнювати."
        onChange={(summary) => set({ summary })}
      />
      <RichTextEditor
        key={`${prefix}-description`}
        label="Опис"
        initialValue={text.description}
        disabled={disabled}
        error={Boolean(textErrors.description)}
        helperText={
          textErrors.description ??
          'Виділіть текст і натисніть кнопку: заголовок, жирний, курсив або список.'
        }
        onChange={(description) => set({ description })}
      />
      <ContentSpecsEditor
        key={`${prefix}-specs`}
        label="Характеристики"
        groups={text.specs}
        disabled={disabled}
        error={textErrors.specs}
        helperText="Група об’єднує характеристики однієї частини: «Куртка», «Брюки»."
        onChange={(specs) => set({ specs })}
      />
    </ReferenceFormSection>
  );
}
