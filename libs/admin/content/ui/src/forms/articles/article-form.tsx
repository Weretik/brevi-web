import { ReferenceFormSection } from '@admin/references/ui';
import { FormControlLabel, InputAdornment, Switch, TextField } from '@mui/material';

import { ArticleCoverField } from './article-cover-field';
import { ArticleTextFields } from './article-text-fields';

import type { ArticleErrors, ArticleFormValues } from '@admin/content/model';
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

/**
 * Editor of an article: the mark, the date, the address, the cover and texts by language. The text is
 * edited in the visual editor with photos of the «Фото» library; nothing is typed as markup.
 */
export function ArticleForm({ values, errors, disabled, isNew, onChange, onPickPhotos }: Props) {
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
        <ArticleCoverField
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
      <ArticleTextFields
        values={values}
        errors={errors}
        disabled={disabled}
        onChange={onChange}
        onPickPhotos={onPickPhotos}
      />
    </>
  );
}
