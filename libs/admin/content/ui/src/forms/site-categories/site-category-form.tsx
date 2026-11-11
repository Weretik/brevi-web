import { siteCategoryLimits, siteCategoryName } from '@admin/content/model';
import { ReferenceFormSection } from '@admin/references/ui';
import { RichTextEditor } from '@admin/shared/ui';
import { FormControlLabel, InputAdornment, MenuItem, Switch, TextField } from '@mui/material';
import { useState } from 'react';

import { ContentLanguageTabs } from '../../components/product-pages/content-language-tabs';

import type {
  ContentLanguage,
  SiteCategoryErrors,
  SiteCategoryFormValues,
  SiteCategoryRow,
  SiteCategoryTextValues,
} from '@admin/content/model';

interface Props {
  values: SiteCategoryFormValues;
  errors: SiteCategoryErrors;
  disabled: boolean;
  /** Categories of the top level this one may sit under (never itself). */
  parents: readonly SiteCategoryRow[];
  /** The category has subcategories, so it must stay on the top level. */
  hasChildren: boolean;
  /** A new category may leave the address empty. */
  isNew: boolean;
  onChange: (values: SiteCategoryFormValues) => void;
}

const counter = (value: string, limit: number) => `${value.trim().length} з ${limit}`;
const top = 'top';

/**
 * Editor of a site category: the mark, the place in the tree, the address and texts by language. The
 * text is edited in the visual editor; nothing is typed as markup.
 */
export function SiteCategoryForm({
  values,
  errors,
  disabled,
  parents,
  hasChildren,
  isNew,
  onChange,
}: Props) {
  const [language, setLanguage] = useState<ContentLanguage>('uk');
  const text = values[language];
  const textErrors = errors[language] ?? {};
  const invalid = (['uk', 'ru'] as const).filter((item) => errors[item]);
  const set = (changes: Partial<SiteCategoryTextValues>) =>
    onChange({ ...values, [language]: { ...text, ...changes } });
  const prefix = `site-category-${language}`;

  return (
    <>
      <ReferenceFormSection title="Розділ">
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
          select
          label="Де стоїть"
          value={values.parentId ?? top}
          disabled={disabled || hasChildren}
          helperText={
            hasChildren
              ? 'У розділу є підрозділи, тому він лишається на верхньому рівні.'
              : 'Верхній рівень або підрозділ іншого розділу. Після перенесення стане останнім.'
          }
          onChange={(event) =>
            onChange({
              ...values,
              parentId: event.target.value === top ? null : Number(event.target.value),
            })
          }
          fullWidth
        >
          <MenuItem value={top}>Верхній рівень</MenuItem>
          {parents.map((parent) => (
            <MenuItem key={parent.id} value={parent.id}>
              Підрозділ у «{siteCategoryName(parent)}»
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Адреса розділу"
          value={values.slug}
          disabled={disabled}
          error={Boolean(errors.slug)}
          helperText={
            errors.slug ??
            (isNew
              ? 'Можна не заповнювати: адреса складеться з назви українською.'
              : 'Частина посилання після /catalog/. Однакова для обох мов.')
          }
          onChange={(event) => onChange({ ...values, slug: event.target.value })}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start">/catalog/</InputAdornment>,
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
    </>
  );
}
