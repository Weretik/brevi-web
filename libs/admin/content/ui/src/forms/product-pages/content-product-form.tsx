import { contentProductLimits, siteCategoryPath } from '@admin/content/model';
import { ReferenceFormSection } from '@admin/references/ui';
import { RichTextEditor } from '@admin/shared/ui';
import { Autocomplete, FormControlLabel, InputAdornment, Switch, TextField } from '@mui/material';
import { useState } from 'react';

import { ContentFactsEditor } from './content-facts-editor';
import { ContentSpecsEditor } from './content-specs-editor';
import { ContentLanguageTabs } from '../../components/product-pages/content-language-tabs';

import type {
  ContentLanguage,
  ContentProductErrors,
  ContentProductFormValues,
  ContentProductTextValues,
  SiteCategoryRow,
} from '@admin/content/model';

interface Props {
  values: ContentProductFormValues;
  errors: ContentProductErrors;
  disabled: boolean;
  /** The tree of «Розділи сайту»; null when the staff member may not see it. */
  categories: readonly SiteCategoryRow[] | null;
  onChange: (values: ContentProductFormValues) => void;
}

const counter = (value: string, limit: number) => `${value.trim().length} з ${limit}`;

/**
 * Editor of a product page: the mark, the address and texts by language. The description is edited in
 * the visual editor, facts and characteristics as rows of fields; nothing is typed as markup.
 */
export function ContentProductForm({ values, errors, disabled, categories, onChange }: Props) {
  const options = categories ?? [];
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
        <Autocomplete
          multiple
          disableCloseOnSelect
          options={options}
          value={options.filter((row) => values.categoryIds?.includes(row.id))}
          disabled={disabled || categories === null || values.categoryIds === null}
          getOptionLabel={(row) => siteCategoryPath(row, options)}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          noOptionsText="Розділів ще немає. Додайте їх у «Розділи сайту»."
          onChange={(_event, rows) =>
            onChange({ ...values, categoryIds: rows.map((row) => row.id) })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Розділи сайту"
              helperText={
                categories === null
                  ? 'Немає права бачити «Розділи сайту», тому розділи товару лишаються як є.'
                  : 'У яких розділах каталогу сайт показує товар. Можна обрати кілька.'
              }
            />
          )}
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
    </>
  );
}
