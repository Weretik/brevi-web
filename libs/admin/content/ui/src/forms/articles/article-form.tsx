import { articleLimits } from '@admin/content/model';
import { ReferenceFormSection } from '@admin/references/ui';
import { RichTextEditor } from '@admin/shared/ui';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import {
  Box,
  Button,
  FormControlLabel,
  InputAdornment,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { ContentLanguageTabs } from '../../components/product-pages/content-language-tabs';

import type {
  ArticleCoverValue,
  ArticleErrors,
  ArticleFormValues,
  ArticleTextValues,
  ContentLanguage,
} from '@admin/content/model';
import type { RichTextImage } from '@admin/shared/ui';

interface Props {
  values: ArticleFormValues;
  errors: ArticleErrors;
  disabled: boolean;
  /** A new article may leave the address empty. */
  isNew: boolean;
  onChange: (values: ArticleFormValues) => void;
  /** Opens the «Фото» library; the chosen photos come back through `done`. */
  onPickPhotos: (done: (photos: RichTextImage[]) => void) => void;
}

const counter = (value: string, limit: number) => `${value.trim().length} з ${limit}`;

function CoverField({
  cover,
  disabled,
  onPick,
  onClear,
}: {
  cover: ArticleCoverValue | null;
  disabled: boolean;
  onPick: () => void;
  onClear: () => void;
}) {
  return (
    <Stack direction="row" sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
      <Box
        role="img"
        aria-label={cover ? 'Обкладинка статті' : 'Обкладинку не обрано'}
        sx={{
          width: 144,
          height: 96,
          flexShrink: 0,
          borderRadius: 1,
          border: 1,
          borderColor: 'divider',
          bgcolor: 'action.hover',
          backgroundImage: cover?.url ? `url("${cover.url}")` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Stack sx={{ gap: 1, minWidth: 0 }}>
        <Typography variant="body2" color={cover && !cover.url ? 'warning.dark' : 'text.secondary'}>
          {cover && !cover.url
            ? 'Обкладинку видалено з бібліотеки «Фото». Оберіть іншу.'
            : 'Обкладинка: фото статті у списку статей і вгорі сторінки. Береться з бібліотеки «Фото».'}
        </Typography>
        <Stack direction="row" sx={{ gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<AddPhotoAlternateOutlinedIcon />}
            disabled={disabled}
            onClick={onPick}
          >
            {cover ? 'Змінити обкладинку' : 'Обрати обкладинку'}
          </Button>
          {cover && (
            <Button disabled={disabled} onClick={onClear}>
              Прибрати
            </Button>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}

/**
 * Editor of an article: the mark, the date, the address, the cover and texts by language. The text is
 * edited in the visual editor with photos of the «Фото» library; nothing is typed as markup.
 */
export function ArticleForm({ values, errors, disabled, isNew, onChange, onPickPhotos }: Props) {
  const [language, setLanguage] = useState<ContentLanguage>('uk');
  const text = values[language];
  const textErrors = errors[language] ?? {};
  const invalid = (['uk', 'ru'] as const).filter((item) => errors[item]);
  const set = (changes: Partial<ArticleTextValues>) =>
    onChange({ ...values, [language]: { ...text, ...changes } });
  const prefix = `article-${language}`;

  return (
    <>
      <ReferenceFormSection title="Стаття">
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
          label="Дата статті"
          type="date"
          value={values.publishedOn}
          disabled={disabled}
          error={Boolean(errors.publishedOn)}
          helperText={errors.publishedOn ?? 'Цю дату бачать читачі. Новіші статті стоять вище.'}
          onChange={(event) => onChange({ ...values, publishedOn: event.target.value })}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ maxWidth: 240 }}
        />
        <TextField
          label="Адреса статті"
          value={values.slug}
          disabled={disabled}
          error={Boolean(errors.slug)}
          helperText={
            errors.slug ??
            (isNew
              ? 'Можна не заповнювати: адреса складеться з назви українською.'
              : 'Частина посилання після /articles/. Однакова для обох мов.')
          }
          onChange={(event) => onChange({ ...values, slug: event.target.value })}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start">/articles/</InputAdornment>,
              sx: { fontFamily: 'var(--admin-font-mono)' },
            },
          }}
          fullWidth
        />
        <CoverField
          cover={values.cover}
          disabled={disabled}
          onPick={() =>
            onPickPhotos((photos) => {
              const photo = photos[0];
              if (photo) onChange({ ...values, cover: { id: photo.photoId, url: photo.src } });
            })
          }
          onClear={() => onChange({ ...values, cover: null })}
        />
      </ReferenceFormSection>
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
    </>
  );
}
