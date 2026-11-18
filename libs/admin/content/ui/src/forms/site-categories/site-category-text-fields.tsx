import { siteCategoryLimits } from '@admin/content/model';
import { ReferenceFormSection } from '@admin/references/ui';
import { RichTextEditor } from '@admin/shared/ui';
import { TextField } from '@mui/material';
import { useState } from 'react';

import { ContentLanguageTabs } from '../../components/product-pages/content-language-tabs';

import type {
  ContentLanguage,
  SiteCategoryErrors,
  SiteCategoryFormValues,
  SiteCategoryTextValues,
} from '@admin/content/model';

const counter = (value: string, limit: number) => `${value.trim().length} з ${limit}`;

/** «Тексти» of a site category by language: the menu name, SEO and the text under the products. */
export function SiteCategoryTextFields({
  values,
  errors,
  disabled,
  onChange,
}: {
  values: SiteCategoryFormValues;
  errors: SiteCategoryErrors;
  disabled: boolean;
  onChange: (values: SiteCategoryFormValues) => void;
}) {
  const [language, setLanguage] = useState<ContentLanguage>('uk');
  const text = values[language];
  const textErrors = errors[language] ?? {};
  const invalid = (['uk', 'ru'] as const).filter((item) => errors[item]);
  const set = (changes: Partial<SiteCategoryTextValues>) =>
    onChange({ ...values, [language]: { ...text, ...changes } });
  const prefix = `site-category-${language}`;
  return (
    <ReferenceFormSection title="Тексти">
      <ContentLanguageTabs value={language} invalid={invalid} onChange={setLanguage} />
      <TextField
        key={`${prefix}-name`}
        label="Назва"
        value={text.name}
        disabled={disabled}
        error={Boolean(textErrors.name)}
        helperText={
          textErrors.name ??
          (language === 'uk'
            ? 'Так розділ називається в меню сайту.'
            : 'Якщо порожньо, російська версія сайту покаже назву українською.')
        }
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
          `Заголовок у пошуку Google. ${counter(text.seoTitle, siteCategoryLimits.seoTitle)}`
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
          `Два речення під заголовком у пошуку. ${counter(text.seoDescription, siteCategoryLimits.seoDescription)}`
        }
        onChange={(event) => set({ seoDescription: event.target.value })}
        multiline
        minRows={2}
        fullWidth
      />
      <RichTextEditor
        key={`${prefix}-text`}
        label="Текст розділу"
        initialValue={text.text}
        disabled={disabled}
        error={Boolean(textErrors.text)}
        helperText={
          textErrors.text ??
          'Показується на сторінці розділу під товарами. Виділіть текст і натисніть кнопку: заголовок, жирний, курсив або список.'
        }
        onChange={(next) => set({ text: next })}
      />
    </ReferenceFormSection>
  );
}
