import { contentProductLimits } from '@admin/content/model';
import { ReferenceFormSection } from '@admin/references/ui';
import { FormControlLabel, InputAdornment, Switch, TextField } from '@mui/material';
import { useState } from 'react';

import { ContentLanguageTabs } from '../../components/product-pages/content-language-tabs';

import type {
  ContentLanguage,
  ContentProductErrors,
  ContentProductFormValues,
  ContentProductTextValues,
} from '@admin/content/model';

interface Props {
  values: ContentProductFormValues;
  errors: ContentProductErrors;
  disabled: boolean;
  onChange: (values: ContentProductFormValues) => void;
}

const counter = (value: string, limit: number) => `${value.trim().length} з ${limit}`;

/**
 * Editor of a product page: the mark, the address and texts by language. Long texts are typed as
 * plain text with light marks, explained under each field.
 */
export function ContentProductForm({ values, errors, disabled, onChange }: Props) {
  const [language, setLanguage] = useState<ContentLanguage>('uk');
  const text = values[language];
  const textErrors = errors[language] ?? {};
  const invalid = (['uk', 'ru'] as const).filter((item) => errors[item]);
  const set = (changes: Partial<ContentProductTextValues>) =>
    onChange({ ...values, [language]: { ...text, ...changes } });
  const prefix = `content-product-${language}`;

  return (
    <>
      <ReferenceFormSection title="Сторінка">
        <FormControlLabel
          control={
            <Switch
              checked={values.showOnSite}
              disabled={disabled}
              onChange={(event) => onChange({ ...values, showOnSite: event.target.checked })}
            />
          }
          label="Показувати на сайті"
        />
        <TextField
          label="Адреса сторінки"
          value={values.slug}
          disabled={disabled}
          error={Boolean(errors.slug)}
          helperText={errors.slug ?? 'Частина посилання після /product/. Однакова для обох мов.'}
          onChange={(event) => onChange({ ...values, slug: event.target.value })}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start">/product/</InputAdornment>,
              sx: { fontFamily: 'var(--admin-font-mono)' },
            },
          }}
          fullWidth
        />
      </ReferenceFormSection>
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
        <TextField
          key={`${prefix}-summary`}
          label="Короткі відомості"
          value={text.summary}
          disabled={disabled}
          error={Boolean(textErrors.summary)}
          helperText={
            textErrors.summary ??
            'Кожен рядок окремо: «Сезон: весна, літо, осінь». Показуються біля фото.'
          }
          onChange={(event) => set({ summary: event.target.value })}
          multiline
          minRows={4}
          fullWidth
        />
        <TextField
          key={`${prefix}-description`}
          label="Опис"
          value={text.description}
          disabled={disabled}
          error={Boolean(textErrors.description)}
          helperText={
            textErrors.description ??
            'Абзаци розділяйте порожнім рядком. «## » на початку рядка: заголовок. «- »: рядок списку. «**Куртка:**» на початку абзацу: жирний початок.'
          }
          onChange={(event) => set({ description: event.target.value })}
          multiline
          minRows={8}
          fullWidth
        />
        <TextField
          key={`${prefix}-specs`}
          label="Характеристики"
          value={text.specs}
          disabled={disabled}
          error={Boolean(textErrors.specs)}
          helperText={
            textErrors.specs ?? '«## Куртка» починає групу, далі рядки «Назва: значення».'
          }
          onChange={(event) => set({ specs: event.target.value })}
          multiline
          minRows={6}
          fullWidth
        />
      </ReferenceFormSection>
    </>
  );
}
